import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ errorConfig }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-zinc-700 mb-4">
          {errorConfig.code}
        </h1>

        <h2 className="text-2xl font-semibold text-white mb-2">
          {errorConfig.title}
        </h2>

        <p className="text-gray-800 mb-8 max-w-md">{errorConfig.message}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
