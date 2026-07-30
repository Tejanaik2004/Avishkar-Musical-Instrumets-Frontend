function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton mb-2"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            height: '14px',
          }}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card h-100">
      <div className="skeleton" style={{ width: '100%', height: '250px' }} />
      <div className="p-3 d-flex flex-column gap-2">
        <div className="skeleton" style={{ width: '80%', height: '18px' }} />
        <div className="skeleton" style={{ width: '50%', height: '14px' }} />
        <div className="d-flex gap-2 mt-1">
          <div className="skeleton" style={{ width: '40%', height: '22px' }} />
          <div className="skeleton" style={{ width: '30%', height: '22px' }} />
        </div>
        <div className="d-flex gap-2 mt-2">
          <div className="skeleton flex-grow-1" style={{ height: '36px' }} />
          <div className="skeleton" style={{ width: '90px', height: '36px' }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonProduct() {
  return (
    <div className="row g-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="col-6 col-md-4 col-lg-3">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

function SkeletonPage() {
  return (
    <div className="container py-4" style={{ minHeight: '60vh' }}>
      <div className="skeleton mb-4" style={{ width: '200px', height: '32px' }} />
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="skeleton" style={{ width: '100%', height: '400px' }} />
        </div>
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-3">
            <div className="skeleton" style={{ width: '60%', height: '28px' }} />
            <SkeletonText lines={4} />
            <div className="skeleton" style={{ width: '40%', height: '32px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count, className = '' }) {
  switch (type) {
    case 'product':
      return (
        <div className={className}>
          <SkeletonProduct />
        </div>
      );

    case 'text':
      return (
        <div className={className}>
          <SkeletonText lines={count || 3} />
        </div>
      );

    case 'page':
      return (
        <div className={className}>
          <SkeletonPage />
        </div>
      );

    case 'card':
    default:
      return (
        <div className={className}>
          <div className="row g-4">
            {Array.from({ length: count || 4 }).map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      );
  }
}
