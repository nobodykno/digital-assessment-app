const NotFound = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <span
        style={{
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-title)',
          fontWeight: 'var(--font-weight-bold)',
        }}
      >
        404
      </span>
    </div>
  );
};

export default NotFound;