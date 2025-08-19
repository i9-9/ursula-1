export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 w-full z-50 py-8">
        <div className="max-w-7xl mx-auto px-2.5 md:px-[15px]">
          <div className="flex justify-between items-baseline">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <nav className="flex gap-4 md:gap-6">
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="pt-[var(--navbar-height)] min-h-screen">
        <div className="max-w-7xl mx-auto px-2.5 md:px-[15px]">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            
            {/* Project Info Panel Skeleton */}
            <div className="col-span-12 lg:col-span-3 pt-8">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="space-y-2">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Area Skeleton */}
            <div className="col-span-12 lg:col-span-6 pt-8">
              <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Navigation Skeleton */}
            <div className="col-span-12 lg:col-span-3 pt-8">
              <div className="flex flex-col items-end space-y-4">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
