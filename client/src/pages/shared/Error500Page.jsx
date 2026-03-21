import ErrorPage from '../../components/error/ErrorPage';

export default function ErrorPage500() {
  return (
    <ErrorPage
      errorConfig={{
        code: '500',
        title: 'Internal Server Error',
        message: 'An unexpected error occurred on our server.',
      }}
    />
  );
}
