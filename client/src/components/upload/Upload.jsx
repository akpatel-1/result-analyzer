import { useRef, useState } from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiFileExcel2Line,
  RiUploadCloud2Line,
} from 'react-icons/ri';

// Allowed file types
const ACCEPTED = ['.json'];
const ACCEPT_MIME = 'application/json,.json';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadStudentResults({ onUpload }) {
  const inputRef = useRef(null);

  // states: 'idle' | 'selected' | 'uploading' | 'done' | 'error'
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({}); // { fileName: progress }
  const [uploadResults, setUploadResults] = useState([]); // { name, success, message }
  const [errorMsg, setErrorMsg] = useState('');

  // ── Validate & set files ──────────────────
  function handleFiles(incoming) {
    if (!incoming || incoming.length === 0) return;

    const validFiles = [];
    const errors = [];

    Array.from(incoming).forEach((f) => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!ACCEPTED.includes(ext)) {
        errors.push(f.name);
      } else {
        validFiles.push(f);
      }
    });

    if (errors.length > 0) {
      setErrorMsg(
        `Invalid files: ${errors.join(', ')}. Only ${ACCEPTED.join(', ')} files are allowed.`
      );
      setStatus('error');
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setStatus('selected');
      setUploadProgress({});
      if (errors.length === 0) {
        setErrorMsg('');
      }
    }
  }

  function handleInputChange(e) {
    handleFiles(e.target.files);
    e.target.value = ''; // reset so same files can be re-selected
  }

  // ── Drag & Drop ──────────────────────────
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
  }

  async function handleUpload() {
    if (files.length === 0 || status === 'uploading') return;

    if (typeof onUpload !== 'function') {
      setStatus('error');
      setErrorMsg('Upload handler is not configured.');
      return;
    }

    try {
      setStatus('uploading');
      setErrorMsg('');
      const results = [];

      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // Simulate progress
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 30,
          }));

          await onUpload(file);

          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }));

          results.push({
            name: file.name,
            success: true,
            message: 'Uploaded successfully',
          });
        } catch (error) {
          const message =
            error?.response?.data?.message || error?.message || 'Upload failed';
          results.push({
            name: file.name,
            success: false,
            message,
          });
        }
      }

      setUploadResults(results);
      setStatus('done');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Upload failed. Please try again.';
      setErrorMsg(message);
      setUploadProgress({});
      setStatus('error');
    }
  }

  return (
    <div className="w-full">
      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <RiUploadCloud2Line size={22} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 leading-tight">
              Upload new student profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Supported formats: .json
            </p>
          </div>
        </div>

        {/* ── IDLE / ERROR: Drop Zone ── */}
        {(status === 'idle' || status === 'error') && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3
              cursor-pointer transition-all duration-200
              ${
                dragOver
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }
            `}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-indigo-100' : 'bg-slate-100'}`}
            >
              <RiUploadCloud2Line
                size={28}
                className={`transition-colors ${dragOver ? 'text-indigo-500' : 'text-slate-400'}`}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                Drag & drop your file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or{' '}
                <span className="text-indigo-500 font-medium underline underline-offset-2">
                  browse to choose a file
                </span>
              </p>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full text-center">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* ── SELECTED: Files list ── */}
        {status === 'selected' && files.length > 0 && (
          <div className="grid grid-cols-5 gap-3">
            {files.map((file) => (
              <div
                key={file.name}
                className="border border-slate-200 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <RiFileExcel2Line size={20} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFiles(files.filter((f) => f.name !== file.name))
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                  title="Remove file"
                >
                  <RiCloseLine size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── UPLOADING: Progress for each file ── */}
        {status === 'uploading' && files.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {files.map((file) => (
              <div
                key={file.name}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <RiFileExcel2Line size={20} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Uploading...{' '}
                      {Math.min(uploadProgress[file.name] || 0, 100)}%
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(uploadProgress[file.name] || 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DONE: Upload results summary ── */}
        {status === 'done' && uploadResults.length > 0 && (
          <div className="space-y-3">
            {uploadResults.some((r) => r.success) ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700">
                  Upload Summary
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {uploadResults.filter((r) => r.success).length} of{' '}
                  {uploadResults.length} files uploaded successfully
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-700">
                  All uploads failed
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {uploadResults.length} of {uploadResults.length} files failed
                </p>
              </div>
            )}

            {/* Individual results */}
            <div className="grid grid-cols-5 gap-3">
              {uploadResults.map((result) => (
                <div
                  key={result.name}
                  className={`border rounded-xl p-4 flex flex-col items-start gap-3 ${
                    result.success
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      result.success ? 'bg-emerald-100' : 'bg-red-100'
                    }`}
                  >
                    {result.success ? (
                      <RiCheckLine size={20} className="text-emerald-600" />
                    ) : (
                      <RiCloseLine size={20} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        result.success ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {result.name}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        result.success ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {status === 'selected' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 py-2 text-sm font-medium text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 active:scale-95 transition-all"
            >
              Upload {files.length} file{files.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Done action buttons */}
        {status === 'done' && (
          <div className="mt-4 flex gap-2">
            {uploadResults.every((r) => !r.success) ? (
              <>
                <button
                  onClick={handleUpload}
                  className="flex-1 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all"
                >
                  Retry
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Clear & Select New
                </button>
              </>
            ) : (
              <button
                onClick={handleReset}
                className="w-full py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all"
              >
                Upload more files
              </button>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MIME}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
