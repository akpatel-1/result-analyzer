import ErrorPage from '../../components/error/ErrorPage';

export default function ErrorPage404() {
  return (
    <ErrorPage
      errorConfig={{
        code: '404',
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist.",
      }}
    />
  );
}
