import ErrorPage from '../../components/error/ErrorPage';

export default function ErrorPage403() {
  return (
    <ErrorPage
      errorConfig={{
        code: '403',
        title: 'Access Denied',
        message: "You don't have permission to access this resource.",
      }}
    />
  );
}
