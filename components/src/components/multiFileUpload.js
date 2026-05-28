(() => ({
  name: 'MultiFileUpload',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useText, useProperty, useModel, Icon } = B;
    const {
      actionId,
      dragDropTitleContent,
      dragDropTitleContentExtra,
      dragDropPreviewActive,
      dragDropSubtitleContent,
      fileSectionPreviewFiles,
      fileSectionListItemUploadIconType,
      fileSectionListItemUploadIcon,
      fileSectionListItemUploadIconSvg,
      fileSectionListItemUploadSuccessIconType,
      fileSectionListItemUploadSuccessIcon,
      fileSectionListItemUploadSuccessIconSvg,
      fileSectionListItemUploadFailedIconType,
      fileSectionListItemUploadFailedIcon,
      fileSectionListItemUploadFailedIconSvg,
      fileSectionListItemRemoveIconType,
      fileSectionListItemRemoveIcon,
      fileSectionListItemRemoveIconSvg,
      dragDropUploadIconType,
      dragDropUploadIcon,
      dragDropUploadIconSvg,
      dragDropUploadIconSize,
      fileUploadAlertIconType,
      fileUploadAlertIcon,
      fileUploadAlertIconSVG,
      fileUploadAlertIconSize,
      fileSectionListItemUploadIconSize,
      fileSectionListItemUploadSuccessIconSize,
      fileSectionListItemUploadFailedIconSize,
      fileSectionListItemRemoveIconSize,
      maxFileSize = 25,
      allowedTypes: allowedTypesRaw,
      model,
      property,
    } = options;
    const { LinearProgress } = window.MaterialUI.Core;
    const isDev = env === 'dev';
    const allowedTypesValue = useText(allowedTypesRaw);
    const [isDragOver, setIsDragOver] = useState(false);
    const rand = () => Math.random().toString(36).slice(2, 7);
    const [inputId] = useState(`file-upload-${rand()}`);
    const devUploadMap = useRef({
      file1: { status: 'pending', file: { name: 'file1', size: 123456 } },
      file2: { status: 'uploading', file: { name: 'file2', size: 123456 } },
      file3: { status: 'finished', file: { name: 'file3', size: 123456 } },
      file4: {
        status: 'failed',
        reason: 'Your proposed upload exceeds the maximum allowed size',
        file: {
          name: 'file4',
          size: 123456,
        },
      },
    }).current;
    const [uploadMap, setUploadMap] = useState(
      isDev && fileSectionPreviewFiles ? devUploadMap : {},
    );

    useEffect(() => {
      if (isDev && fileSectionPreviewFiles) {
        setUploadMap(devUploadMap);
      } else {
        setUploadMap({});
      }
    }, [isDev, fileSectionPreviewFiles]);

    const getArtifactInfo = (id, type) => {
      const info = window.artifact[type][id];
      if (!info) {
        throw new Error(`${id} not found in artifact`);
      }
      return info;
    };

    const generateUploadRequest = async (file) => {
      try {
        const origin = window.location.origin;
        const apiEndpoint = window.artifact.apiUrl;
        const appUUID = window.artifact.applicationId;
        if (!origin || !apiEndpoint || !appUUID) {
          throw new Error('Unable to form API url!');
        }
        const modelInfo = getArtifactInfo(model, 'models');
        if (!modelInfo) {
          throw new Error('Please select a model to allow file uploading');
        }

        const propertyInfo = getArtifactInfo(property.id[0], 'properties');
        if (!propertyInfo) {
          throw new Error('Please select a valid file property');
        }

        const apiURL = `${origin}${apiEndpoint}/${appUUID}`;

        const response = await fetch(apiURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operationName: 'GenerateFileUploadRequest',
            variables: {
              modelName: modelInfo.name,
              propertyName: propertyInfo.name,
              contentType: file.type,
              filename: file.name,
            },
            query: `mutation GenerateFileUploadRequest($modelName: String!, $propertyName: String!, $contentType: String!, $filename: String!) {
  generateFileUploadRequest(modelName: $modelName, propertyName: $propertyName, contentType: $contentType, fileName: $filename) {
    ... on PresignedPostRequest {
      reference
      fields
      url
    }
  }
}`,
          }),
        });

        const { data, errors } = await response.json();

        const result = data?.generateFileUploadRequest;

        if (errors) {
          setUploadMap((prev) => ({
            ...prev,
            [file.name]: { file, status: 'failed', reason: errors[0].message },
          }));
        } else {
          setUploadMap((prev) => ({
            ...prev,
            [file.name]: { file, status: 'uploading', ref: result.reference },
          }));
        }

        return result;
      } catch (err) {
        setUploadMap((prev) => ({
          ...prev,
          [file.name]: { file, status: 'failed', reason: err?.message },
        }));
      }
    };

    const uploadFile = async (uploadRequest, file) => {
      const { url, fields } = uploadRequest;
      const parsedFields =
        typeof fields === 'string' ? JSON.parse(fields) : fields;

      const formData = new FormData();
      Object.entries(parsedFields).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append('file', file);

      const response = await fetch(url, { method: 'POST', body: formData });

      if (!response.ok) {
        const body = await response.text();
        const xml = new DOMParser().parseFromString(body, 'text/xml');
        const reason =
          xml.querySelector('Message')?.textContent ?? 'Upload failed';
        setUploadMap((prev) => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'failed',
            reason,
          },
        }));
      } else {
        setUploadMap((prev) => {
          if (!prev[file.name]) {
            // Removed by user while uploading
            return prev;
          }
          return {
            ...prev,
            [file.name]: { ...prev[file.name], status: 'finished' },
          };
        });
      }
    };

    const isTypeAllowed = (file) => {
      const allowed = allowedTypesValue.trim();
      if (!allowed || allowed === '*') return true;
      return allowed
        .split(',')
        .map((t) => t.trim())
        .some((pattern) => {
          if (pattern.endsWith('/*')) {
            return file.type.startsWith(pattern.slice(0, -1));
          }
          return file.type === pattern;
        });
    };

    const onFileDrop = async (files) => {
      const maxBytes = (maxFileSize || 25) * 1024 * 1024;
      const newFiles = Object.fromEntries(
        files.map((file) => {
          if (!isTypeAllowed(file)) {
            return [
              file.name,
              {
                file,
                status: 'failed',
                reason: `File type "${file.type}" is not allowed`,
              },
            ];
          }
          if (file.size > maxBytes) {
            return [
              file.name,
              {
                file,
                status: 'failed',
                reason: `File exceeds the ${maxFileSize || 25} MB size limit`,
              },
            ];
          }
          return [file.name, { file, status: 'pending' }];
        }),
      );
      setUploadMap((prev) => ({ ...prev, ...newFiles }));
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (newFiles[file.name].status === 'failed') continue;
        const uploadRequest = await generateUploadRequest(file);
        if (!uploadRequest) continue;
        await uploadFile(uploadRequest, file);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      onFileDrop(files);
    };

    const handleInputChange = (e) => {
      const files = Array.from(e.target.files);
      onFileDrop(files);
      e.target.value = '';
    };

    const combineClassNames = (...classNames) => {
      if (!Array.isArray(classNames)) {
        throw new Error('combineClassNames: classNames is not an array');
      }
      return classNames.filter(Boolean).join(' ');
    };

    const uploadFileStatusClass = (status) => {
      switch (status) {
        case 'pending':
          return classes.fileStatusPending;
        case 'uploading':
          return classes.fileStatusUploading;
        case 'failed':
          return classes.fileStatusFailed;
        case 'finished':
          return classes.fileStatusFinished;
      }
    };

    const getFileSizeLabel = (size) => {
      if (size >= 1e9) {
        const gb = Number(size / (1000 * 1000 * 1000)).toFixed(2);
        return `${gb} GB`;
      }
      if (size >= 1e6) {
        const mb = Number(size / (1000 * 1000)).toFixed(2);
        return `${mb} MB`;
      }
      const b = Number(size / 1000).toFixed(2);
      return `${b} B`;
    };

    const getDoneFilesLength = () => {
      return Object.values(uploadMap).filter(
        (f) => f.status === 'failed' || f.status === 'finished',
      ).length;
    };
    const getFilesInProgressLength = () => {
      return Object.values(uploadMap).filter(
        (f) => f.status !== 'failed' && f.status !== 'finished',
      ).length;
    };

    const removeUpload = (e) => {
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      if (!id) return;
      setUploadMap((prev) => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
    };

    const ConfigurableIcon = ({ type, svg, name, size }) => {
      const px = `${size}px`;
      return type === 'svg' ? (
        <div
          style={{ fontSize: px, display: 'inline-flex' }}
          dangerouslySetInnerHTML={{ __html: useText(svg) }}
        />
      ) : (
        <Icon name={name} style={{ fontSize: px }} />
      );
    };

    const filterFiles = (status) => {
      return Object.values(uploadMap).filter(
        (upload) => upload.status === status,
      );
    };

    const getUploadedFiles = () => {
      return filterFiles('finished')
        .map((upload) => upload.ref)
        .join(',');
    };

    const getFailedUploads = () => {
      return filterFiles('failed');
    };

    const pluralizeFiles = (count) => (count === 1 ? 'file' : 'files');

    if (!isDev && !model) {
      return <p>Please select a model</p>;
    }

    if (!isDev && !property) {
      return <p>Please select a property</p>;
    }

    return (
      <div className={classes.root} data-component={'MultiFileUpload'}>
        <input
          type="hidden"
          key={getUploadedFiles() ? 'hasValue' : 'isEmpty'}
          name={actionId}
          value={getUploadedFiles()}
        />
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={combineClassNames(
            classes.dropzone,
            Object.keys(uploadMap).length > 0
              ? classes.dropzoneFilled
              : classes.dropzoneEmpty,
            isDragOver || (isDev && dragDropPreviewActive)
              ? classes.dropzoneActive
              : classes.dropzoneInactive,
          )}
          style={{
            pointerEvents: isDev ? 'none' : 'auto',
          }}
          disabled={isDev}
        >
          <input
            disabled={isDev}
            id={inputId}
            type="file"
            multiple
            accept={
              allowedTypesValue.trim() === '*' ? undefined : allowedTypesValue
            }
            style={{ display: 'none', pointerEvents: isDev ? 'none' : 'auto' }}
            onChange={handleInputChange}
          />
          <span className={classes.dragDropUploadIcon}>
            <ConfigurableIcon
              type={dragDropUploadIconType}
              svg={dragDropUploadIconSvg}
              name={dragDropUploadIcon}
              size={dragDropUploadIconSize}
            />
          </span>
          <span className={classes.dragDropTitle}>
            {isDragOver
              ? useText(dragDropTitleContentExtra)
              : useText(dragDropTitleContent)}
          </span>
          <span className={classes.dragDropSubTitle}>
            {useText(dragDropSubtitleContent)}
          </span>
        </label>
        {getFailedUploads().length > 0 && (
          <div className={classes.fileUploadAlert}>
            <span className={classes.fileUploadAlertIcon}>
              <ConfigurableIcon
                type={fileUploadAlertIconType}
                svg={fileUploadAlertIconSVG}
                name={fileUploadAlertIcon}
                size={fileUploadAlertIconSize}
              />
            </span>
            <p>
              <b>
                {getFailedUploads().length}{' '}
                {pluralizeFiles(getFailedUploads().length)} can't be uploaded
              </b>
              <br />
              Remove the rejected files below, or send the{' '}
              {filterFiles('finished').length} valid{' '}
              {pluralizeFiles(filterFiles('finished').length)} to the staging
              queue and retry the rest separately
            </p>
          </div>
        )}
        <div className={classes.fileSection}>
          <span className={classes.fileSectionTitle}>
            {Object.keys(uploadMap).length}{' '}
            {pluralizeFiles(Object.keys(uploadMap).length)} in this batch ·{' '}
            {getDoneFilesLength()} done, {getFilesInProgressLength()} in
            progress
          </span>
          <div className={classes.fileSectionList}>
            {Object.values(uploadMap).map((upload) => (
              <div
                key={upload.file.name}
                className={classes.fileSectionListItem}
              >
                <div className={classes.fileUploadTitleSection}>
                  {upload.status === 'failed' && (
                    <ConfigurableIcon
                      type={fileSectionListItemUploadFailedIconType}
                      svg={fileSectionListItemUploadFailedIconSvg}
                      name={fileSectionListItemUploadFailedIcon}
                      size={fileSectionListItemUploadFailedIconSize}
                    />
                  )}
                  {upload.status === 'finished' && (
                    <ConfigurableIcon
                      type={fileSectionListItemUploadSuccessIconType}
                      svg={fileSectionListItemUploadSuccessIconSvg}
                      name={fileSectionListItemUploadSuccessIcon}
                      size={fileSectionListItemUploadSuccessIconSize}
                    />
                  )}
                  {upload.status !== 'failed' &&
                    upload.status !== 'finished' && (
                      <ConfigurableIcon
                        type={fileSectionListItemUploadIconType}
                        svg={fileSectionListItemUploadIconSvg}
                        name={fileSectionListItemUploadIcon}
                        size={fileSectionListItemUploadIconSize}
                      />
                    )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className={classes.fileUploadTitle}>
                      {upload.file.name}
                    </p>
                    {upload.status === 'failed' && (
                      <span className={classes.fileUploadFailed}>
                        {upload.reason}
                      </span>
                    )}
                  </div>
                </div>
                <div className={classes.fileUploadInfo}>
                  <span>{getFileSizeLabel(upload.file.size)}</span>
                  <div
                    className={combineClassNames(
                      uploadFileStatusClass(upload.status),
                      classes.fileUploadStatus,
                    )}
                  >
                    {' '}
                    <span>{upload.status}</span>
                    {upload.status !== 'finished' &&
                      upload.status !== 'failed' &&
                      upload.status !== 'pending' && (
                        <LinearProgress
                          classes={{
                            root: classes.fileStatusProgress,
                            colorPrimary: classes.fileStatusProgressColor,
                            barColorPrimary: classes.fileStatusProgressBar,
                          }}
                          variant="indeterminate"
                          /* value={50}
                           * valueBuffer={1}
                           * thickness={2}
                           **/
                          size={100}
                          data-component={'Progress'}
                        />
                      )}
                    {(upload.status === 'finished' ||
                      upload.status === 'failed') && (
                      <LinearProgress
                        classes={{
                          root: classes.fileStatusProgress,
                          colorPrimary: classes.fileStatusProgressColor,
                          barColorPrimary:
                            upload.status === 'finished'
                              ? classes.fileStatusProgressFinishedBar
                              : classes.fileStatusProgressFailedBar,
                        }}
                        variant="determinate"
                        value={100}
                        valueBuffer={1}
                        size={100}
                        data-component={'Progress'}
                      />
                    )}
                  </div>
                  <button
                    className={classes.removeUploadBtn}
                    onClick={removeUpload}
                    data-id={upload.file.name}
                    style={{ pointerEvents: isDev ? 'none' : 'auto' }}
                    type="button"
                  >
                    <div style={{ marginTop: '2px' }}>
                      <ConfigurableIcon
                        type={fileSectionListItemRemoveIconType}
                        svg={fileSectionListItemRemoveIconSvg}
                        name={fileSectionListItemRemoveIcon}
                        size={fileSectionListItemRemoveIconSize}
                      />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })(),
  styles: (B) => (t) => {
    const { mediaMinWidth, Styling } = B;
    const style = new Styling(t);

    const convertSizes = (sizes, device = 'Mobile') =>
      sizes.map((size) => style.getSpacing(size, device)).join(' ');

    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '1rem',
        margin: ({ options: { rootOuterSpacing } }) =>
          convertSizes(rootOuterSpacing),
        [`@media ${mediaMinWidth(600)}`]: {
          margin: ({ options: { rootOuterSpacing } }) =>
            convertSizes(rootOuterSpacing, 'Portrait'),
        },
        [`@media ${mediaMinWidth(960)}`]: {
          margin: ({ options: { rootOuterSpacing } }) =>
            convertSizes(rootOuterSpacing, 'Landscape'),
        },
        [`@media ${mediaMinWidth(1280)}`]: {
          margin: ({ options: { rootOuterSpacing } }) =>
            convertSizes(rootOuterSpacing, 'Desktop'),
        },
      },
      dropzone: {
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: ({ options: { dragDropBorderRadius } }) =>
          dragDropBorderRadius,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 150ms, background 150ms',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      },
      dropzoneInactive: {
        border: ({
          options: {
            dragDropBorderSize,
            dragDropBorderType,
            dragDropBorderColor,
          },
        }) =>
          [dragDropBorderSize, dragDropBorderType, dragDropBorderColor].join(
            ' ',
          ),
        background: ({ options: { dragDropBackground } }) => dragDropBackground,
      },
      dropzoneActive: {
        border: ({
          options: {
            dragDropBorderSize,
            dragDropBorderType,
            dragDropActiveBorderColor,
          },
        }) =>
          [
            dragDropBorderSize,
            dragDropBorderType,
            dragDropActiveBorderColor,
          ].join(' '),
        background: ({ options: { dragDropActiveBackground } }) =>
          dragDropActiveBackground,
      },
      dropzoneEmpty: {
        padding: '56px 24px',
        flexDirection: 'column',
      },
      dropzoneFilled: {
        flexDirection: 'row',
        padding: '2rem',
      },
      dragDropTitle: {
        color: ({ options: { dragDropTitleColor, dragDropTitleType } }) => {
          return dragDropTitleColor === '[Inherit]'
            ? style.getFontColor(dragDropTitleType)
            : style.getColor(dragDropTitleColor);
        },
        fontFamily: ({ options: { dragDropTitleType } }) =>
          `var(--text-fontFamily-${dragDropTitleType
            .toString()
            .toLowerCase()})`,
        fontSize: ({ options: { dragDropTitleType } }) =>
          `var(--text-fontSize-${dragDropTitleType.toString().toLowerCase()})`,
        fontStyle: ({ options: { dragDropTitleType } }) =>
          `var(--text-fontStyle-${dragDropTitleType.toString().toLowerCase()})`,
        fontWeight: ({
          options: { dragDropTitleType, dragDropTitleFontWeight },
        }) => {
          return dragDropTitleFontWeight === '[Inherit]'
            ? style.getFontWeight(dragDropTitleType)
            : dragDropTitleFontWeight;
        },
      },
      dragDropSubTitle: {
        color: ({
          options: { dragDropSubtitleColor, dragDropSubtitleType },
        }) => {
          return dragDropSubtitleColor === '[Inherit]'
            ? style.getFontColor(dragDropSubtitleType)
            : style.getColor(dragDropSubtitleColor);
        },
        fontFamily: ({ options: { dragDropSubtitleType } }) =>
          `var(--text-fontFamily-${dragDropSubtitleType
            .toString()
            .toLowerCase()})`,
        fontSize: ({ options: { dragDropSubtitleType } }) =>
          `var(--text-fontSize-${dragDropSubtitleType
            .toString()
            .toLowerCase()})`,
        fontStyle: ({ options: { dragDropSubtitleType } }) =>
          `var(--text-fontStyle-${dragDropSubtitleType
            .toString()
            .toLowerCase()})`,
        fontWeight: ({
          options: { dragDropSubtitleType, dragDropSubtitleFontWeight },
        }) =>
          dragDropSubtitleFontWeight === '[Inherit]'
            ? style.getFontWeight(dragDropSubtitleType)
            : dragDropSubtitleFontWeight,
      },
      fileSectionTitle: {
        marginBottom: '1rem',
        color: ({
          options: { fileSectionTitleFontColor, fileSectionTitleFontType },
        }) => {
          return fileSectionTitleFontColor === '[Inherit]'
            ? style.getFontColor(fileSectionTitleFontType)
            : style.getColor(fileSectionTitleFontColor);
        },
        fontFamily: ({ options: { fileSectionTitleFontType } }) =>
          `var(--text-fontFamily-${fileSectionTitleFontType
            .toString()
            .toLowerCase()})`,
        fontSize: ({ options: { fileSectionTitleFontType } }) =>
          `var(--text-fontSize-${fileSectionTitleFontType
            .toString()
            .toLowerCase()})`,
        fontStyle: ({ options: { fileSectionTitleFontType } }) =>
          `var(--text-fontStyle-${fileSectionTitleFontType
            .toString()
            .toLowerCase()})`,
        fontWeight: ({
          options: { fileSectionTitleFontType, fileSectionTitleFontWeight },
        }) =>
          fileSectionTitleFontWeight === '[Inherit]'
            ? style.getFontWeight(fileSectionTitleFontType)
            : fileSectionTitleFontWeight,
      },
      fileSection: {
        // empty stub
      },
      fileSectionList: {
        display: 'grid',
        alignItems: 'center',
        boxShadow:
          '0 2px 1px -1px rgba(0,0,0,0.2),0 1px 1px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.12)',
        maxHeight: ({ options: { fileSectionMaxHeight } }) =>
          fileSectionMaxHeight,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: ({ options: { fileSectionBackground } }) =>
          fileSectionBackground,
        borderRadius: ({ options: { fileSectionBorderRadius } }) =>
          fileSectionBorderRadius,
        border: ({
          options: { fileSectionBorderColor, fileSectionBorderSize },
        }) => `${fileSectionBorderSize} solid ${fileSectionBorderColor}`,
      },
      fileSectionListItem: {
        fontFamily: ({ options: { fileSectionListItemFontType } }) =>
          `var(--text-fontFamily-${fileSectionListItemFontType
            .toString()
            .toLowerCase()})`,
        fontSize: ({ options: { fileSectionListItemFontType } }) =>
          `var(--text-fontSize-${fileSectionListItemFontType
            .toString()
            .toLowerCase()})`,
        fontStyle: ({ options: { fileSectionListItemFontType } }) =>
          `var(--text-fontStyle-${fileSectionListItemFontType
            .toString()
            .toLowerCase()})`,
        fontWeight: ({
          options: {
            fileSectionListItemFontType,
            fileSectionListItemFontWeight,
          },
        }) => {
          return fileSectionListItemFontWeight === '[Inherit]'
            ? style.getFontWeight(fileSectionListItemFontType)
            : fileSectionListItemFontWeight;
        },
        color: ({
          options: {
            fileSectionListItemFontColor,
            fileSectionListItemFontType,
          },
        }) =>
          fileSectionListItemFontType === '[Inherit]'
            ? style.getFontColor(fileSectionListItemFontType)
            : style.getColor(fileSectionListItemFontColor),
        padding: ({ options: { fileSectionListItemInnerSpace } }) =>
          convertSizes(fileSectionListItemInnerSpace),
        [`@media ${mediaMinWidth(600)}`]: {
          padding: ({ options: { fileSectionListItemInnerSpace } }) =>
            convertSizes(fileSectionListItemInnerSpace, 'Portrait'),
        },
        [`@media ${mediaMinWidth(960)}`]: {
          padding: ({ options: { fileSectionListItemInnerSpace } }) =>
            convertSizes(fileSectionListItemInnerSpace, 'Landscape'),
        },
        [`@media ${mediaMinWidth(1280)}`]: {
          padding: ({ options: { fileSectionListItemInnerSpace } }) =>
            convertSizes(fileSectionListItemInnerSpace, 'Desktop'),
        },
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        '&:not(:last-child)': {
          borderBottom: ({
            options: {
              fileSectionListItemBorderSize,
              fileSectionListItemBorderColor,
            },
          }) =>
            [
              fileSectionListItemBorderSize,
              'solid',
              fileSectionListItemBorderColor,
            ].join(' '),
        },
      },
      fileUploadTitleSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      },
      fileUploadTitle: {
        padding: '0px !important',
        margin: '0px !important',
      },
      fileUploadInfo: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      },
      fileUploadAlert: {
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem',
        background: ({ options: { fileUploadAlertBackground } }) =>
          style.getColor(fileUploadAlertBackground),
        color: ({ options: { fileUploadAlertColor } }) =>
          style.getColor(fileUploadAlertColor),
        fontFamily: 'var(--text-fontFamily-body1)',
      },
      dragDropUploadIcon: {
        color: ({ options: { dragDropUploadIconColor } }) =>
          style.getColor(dragDropUploadIconColor),
      },
      fileUploadAlertIcon: {
        color: ({ options: { fileUploadAlertIconColor } }) =>
          style.getColor(fileUploadAlertIconColor),
      },
      fileUploadStatus: {
        textTransform: ({ options: { fileUploadStatusTextTransform } }) =>
          fileUploadStatusTextTransform,
        fontFamily: ({ options: { fileUploadStatusFontType } }) =>
          `var(--text-fontFamily-${fileUploadStatusFontType
            .toString()
            .toLowerCase()})`,
        fontSize: ({ options: { fileUploadStatusFontType } }) =>
          `var(--text-fontSize-${fileUploadStatusFontType
            .toString()
            .toLowerCase()})`,
        fontStyle: ({ options: { fileUploadStatusFontType } }) =>
          `var(--text-fontStyle-${fileUploadStatusFontType
            .toString()
            .toLowerCase()})`,
        fontWeight: ({
          options: { fileUploadStatusFontType, fileUploadStatusFontWeight },
        }) =>
          fileUploadStatusFontWeight === '[Inherit]'
            ? style.getFontWeight(fileUploadStatusFontType)
            : fileUploadStatusFontWeight,
      },
      fileUploadFailed: {
        color: ({ options: { errorColor } }) => style.getColor(errorColor),
        fontSize: '12px',
      },
      fileStatusPending: {
        color: ({ options: { fileUploadStatusPendingFontColor } }) =>
          style.getColor(fileUploadStatusPendingFontColor),
      },
      fileStatusUploading: {
        color: ({ options: { fileUploadStatusUploadingFontColor } }) =>
          style.getColor(fileUploadStatusUploadingFontColor),
      },
      fileStatusFinished: {
        color: ({ options: { fileUploadStatusFinishedColor } }) =>
          style.getColor(fileUploadStatusFinishedColor),
      },
      fileStatusFailed: {
        color: ({ options: { errorColor } }) => style.getColor(errorColor),
      },
      fileStatusProgress: {
        width: ({ options: { fileUploadStatusProgressWidth } }) =>
          [fileUploadStatusProgressWidth, '!important'].join(' '),
      },
      fileStatusProgressFinishedBar: {
        backgroundColor: ({ options: { fileUploadStatusFinishedColor } }) =>
          [style.getColor(fileUploadStatusFinishedColor), '!important'].join(
            ' ',
          ),
      },
      fileStatusProgressFailedBar: {
        backgroundColor: ({ options: { errorColor } }) =>
          [style.getColor(errorColor), '!important'].join(' '),
      },
      fileStatusProgressColor: {
        backgroundColor: ({
          options: { fileUploadStatusProgressBackground },
        }) => [fileUploadStatusProgressBackground, '!important'].join(' '),
      },
      fileStatusProgressBar: {
        backgroundColor: ({ options: { fileUploadStatusUploadingColor } }) =>
          [fileUploadStatusUploadingColor, '!important'].join(' '),
      },
      removeUploadBtn: {
        background: 'none',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        borderRadius: '100%',
        aspectRatio: '1',
        transition: 'background 150ms',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: 'rgba(211, 47, 46, 0.2)',
        },
      },
    };
  },
}))();
