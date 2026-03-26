import { useRef, useState } from 'react';
import { BsFiletypeJson } from 'react-icons/bs';
import { RiCheckLine, RiCloseLine, RiUploadCloud2Line } from 'react-icons/ri';

const DEFAULT_ACCEPTED = ['.json'];
const DEFAULT_ACCEPT_MIME = 'application/json,.json';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadStudentResults({
  onUpload,
  title = 'Upload files',
  acceptedExtensions = DEFAULT_ACCEPTED,
  acceptMime = DEFAULT_ACCEPT_MIME,
  multiple = true,
  dropzoneLabel,
  browseLabel = 'browse to choose a file',
}) {
  const inputRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [response, setResponse] = useState(null);

  const allowedExtensions =
    acceptedExtensions?.length > 0 ? acceptedExtensions : DEFAULT_ACCEPTED;
  const supportedFormatsText = allowedExtensions.join(', ');
  const dropText =
    dropzoneLabel || `Drag & drop your file${multiple ? 's' : ''} here`;

  function handleFiles(incoming) {
    if (!incoming || incoming.length === 0) return;

    const validFiles = [];
    const errors = [];

    Array.from(incoming).forEach((f) => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) errors.push(f.name);
      else validFiles.push(f);
    });

    if (errors.length > 0) {
      setErrorMsg(
        `Invalid: ${errors.join(', ')}. Only ${allowedExtensions.join(', ')} allowed.`
      );
      setStatus('error');
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setStatus('selected');
      setUploadProgress({});
      if (errors.length === 0) setErrorMsg('');
    }
  }

  function handleInputChange(e) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleReset() {
    setFiles([]);
    setStatus('idle');
    setUploadProgress({});
    setUploadResults([]);
    setErrorMsg('');
    setResponse(null);
  }

  async function handleUpload() {
    if (files.length === 0 || status === 'uploading') return;

    try {
      setStatus('uploading');
      setErrorMsg('');
      setResponse(null);

      const progressInit = {};
      files.forEach((f) => (progressInit[f.name] = 30));
      setUploadProgress(progressInit);

      const serverResponse = await onUpload(files);
      const payload = serverResponse?.data ?? serverResponse;
      setResponse(payload);

      const progressDone = {};
      files.forEach((f) => (progressDone[f.name] = 100));
      setUploadProgress(progressDone);

      const successList = (
        payload?.status?.success ||
        payload?.success ||
        []
      ).map((v) => String(v));
      const failedList = payload?.status?.failed || payload?.failed || [];
      const skippedRollNos = new Set(
        (payload?.skippedRollNos || []).map(String)
      );

      const extractRollNo = (fileName) => {
        const base = fileName.replace(/\.json$/i, '').split('_')[0];
        return base.replace(/\D/g, '') || base;
      };

      const rollMatches = (serverRollNo, fileDigits) => {
        const s = String(serverRollNo ?? '');
        const f = String(fileDigits ?? '');
        if (!s || !f) return false;
        return s === f || s.endsWith(f) || f.endsWith(s);
      };

      const results = files.map((f) => {
        const fileDigits = extractRollNo(f.name);

        const failedItem = failedList.find((item) =>
          rollMatches(item?.roll_no, fileDigits)
        );
        if (failedItem) {
          return {
            name: f.name,
            rollNo: String(failedItem.roll_no ?? fileDigits),
            success: false,
            skipped: false,
            message: failedItem.error || 'Upload failed',
          };
        }

        const skippedMatch = [...skippedRollNos].find((s) =>
          rollMatches(s, fileDigits)
        );
        if (skippedMatch) {
          return {
            name: f.name,
            rollNo: skippedMatch,
            success: false,
            skipped: true,
            message: 'Skipped (already exists)',
          };
        }

        const successMatch = successList.find((s) =>
          rollMatches(s, fileDigits)
        );
        if (successMatch) {
          return {
            name: f.name,
            rollNo: successMatch,
            success: true,
            skipped: false,
            message: 'Uploaded successfully',
          };
        }

        return {
          name: f.name,
          rollNo: fileDigits,
          success: false,
          skipped: false,
          message: 'Upload status not returned for this file',
        };
      });

      setUploadResults(results);
      setStatus('done');
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Upload failed';
      const failedResults = files.map((f) => ({
        name: f.name,
        success: false,
        skipped: false,
        message,
      }));
      setErrorMsg(message);
      setUploadProgress({});
      setUploadResults(failedResults);
      setStatus('done');
    }
  }

  return (
    <div className="w-full">
      <div className="border border-border bg-surface rounded-xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <RiUploadCloud2Line size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary leading-tight">
              {title}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Supported: {supportedFormatsText}
            </p>
          </div>
        </div>

        {/* ── IDLE / ERROR: Dropzone ── */}
        {(status === 'idle' || status === 'error') && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={[
              'border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors duration-150',
              dragOver
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50 hover:bg-surface-raised',
            ].join(' ')}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragOver ? 'bg-accent/10' : 'bg-surface-raised'}`}
            >
              <RiUploadCloud2Line
                size={24}
                className={dragOver ? 'text-accent' : 'text-text-muted'}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                {dropText}
              </p>
              <p className="text-xs text-text-muted mt-1">
                or{' '}
                <span className="text-accent font-medium underline underline-offset-2">
                  {browseLabel}
                </span>
              </p>
            </div>

            {status === 'error' && errorMsg && (
              <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 w-full text-center">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* ── SELECTED: File list ── */}
        {status === 'selected' && files.length > 0 && (
          <div className="grid grid-cols-5 gap-2.5">
            {files.map((file) => (
              <div
                key={file.name}
                className="border border-border bg-surface-raised rounded-xl p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BsFiletypeJson size={17} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const remaining = files.filter((f) => f.name !== file.name);
                    setFiles(remaining);
                    if (remaining.length === 0) setStatus('idle');
                  }}
                  className="p-1 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors shrink-0"
                  title="Remove"
                >
                  <RiCloseLine size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── UPLOADING: Progress ── */}
        {status === 'uploading' && files.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {files.map((file) => (
              <div
                key={file.name}
                className="border border-border bg-surface-raised rounded-xl p-3"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <BsFiletypeJson size={17} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Uploading… {Math.min(uploadProgress[file.name] || 0, 100)}
                      %
                    </p>
                  </div>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden bg-border">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(uploadProgress[file.name] || 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DONE: Summary + results ── */}
        {status === 'done' && uploadResults.length > 0 && (
          <div className="space-y-3">
            {/* Summary */}
            {uploadResults.some((r) => r.success) ? (
              <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <RiCheckLine size={17} className="text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    Upload Summary
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">
                        Successful
                      </p>
                      <p className="text-xl font-bold text-emerald-500 mt-0.5">
                        {response?.status?.success?.length ??
                          uploadResults.filter((r) => r.success && !r.skipped)
                            .length}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wide">
                        Skipped
                      </p>
                      <p className="text-xl font-bold text-amber-500 mt-0.5">
                        {response?.skippedRollNos?.length ??
                          uploadResults.filter((r) => r.skipped).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-red-500 uppercase tracking-wide">
                        Failed
                      </p>
                      <p className="text-xl font-bold text-red-500 mt-0.5">
                        {response?.status?.failed?.length ??
                          uploadResults.filter((r) => !r.success && !r.skipped)
                            .length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <RiCloseLine size={17} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    All uploads failed
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {uploadResults.length} of {uploadResults.length} files
                    failed
                  </p>
                </div>
              </div>
            )}

            {/* Individual results */}
            <div className="grid grid-cols-3 gap-2.5">
              {uploadResults.map((result) => {
                const tone = result.success
                  ? {
                      card: 'border-emerald-500/20 bg-emerald-500/5',
                      iconWrap: 'bg-emerald-500/10',
                      icon: 'text-emerald-500',
                      title: 'text-emerald-700 dark:text-emerald-300',
                      roll: 'text-emerald-500',
                      message: 'text-emerald-700 dark:text-emerald-300',
                    }
                  : result.skipped
                    ? {
                        card: 'border-amber-500/20 bg-amber-500/5',
                        iconWrap: 'bg-amber-500/10',
                        icon: 'text-amber-500',
                        title: 'text-amber-700 dark:text-amber-300',
                        roll: 'text-amber-500',
                        message: 'text-amber-700 dark:text-amber-300',
                      }
                    : {
                        card: 'border-red-500/20 bg-red-500/5',
                        iconWrap: 'bg-red-500/10',
                        icon: 'text-red-500',
                        title: 'text-red-700 dark:text-red-300',
                        roll: 'text-red-500',
                        message: 'text-red-700 dark:text-red-300',
                      };
                return (
                  <div
                    key={result.name}
                    className={`border rounded-xl p-3.5 flex flex-col gap-2 ${tone.card}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tone.iconWrap}`}
                    >
                      {result.success ? (
                        <RiCheckLine size={15} className={tone.icon} />
                      ) : (
                        <RiCloseLine size={15} className={tone.icon} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${tone.title}`}
                      >
                        {result.name}
                      </p>
                      {result.rollNo && (
                        <p
                          className={`text-[10px] font-mono mt-0.5 ${tone.roll}`}
                        >
                          Roll: {result.rollNo}
                        </p>
                      )}
                      <p
                        className={`text-[10px] mt-1.5 leading-relaxed ${tone.message}`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        {status === 'selected' && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleReset} className="btn-ghost flex-1">
              Cancel
            </button>
            <button onClick={handleUpload} className="btn-primary flex-1">
              Upload {files.length} file{files.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {status === 'done' && (
          <div className="flex gap-2 mt-4">
            {uploadResults.every((r) => !r.success && !r.skipped) ? (
              <>
                <button
                  onClick={handleUpload}
                  className="flex-1 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:scale-[0.98] transition-all"
                >
                  Retry
                </button>
                <button onClick={handleReset} className="btn-ghost flex-1">
                  Clear & Select New
                </button>
              </>
            ) : (
              <button
                onClick={handleReset}
                className="w-full py-2 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-all"
              >
                Upload more files
              </button>
            )}
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptMime}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
