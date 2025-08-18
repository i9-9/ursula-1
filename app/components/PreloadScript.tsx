const PreloadScript = () => {
  const script = `
    (function() {
      try {
        var criticalVideos = document.querySelectorAll('video[data-loading="eager"]');
        criticalVideos.forEach(function(video){
          try { video.load(); } catch(e) {}
        });
        var preconnects = [];
        preconnects.forEach(function(url){
          var link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          document.head.appendChild(link);
        });
      } catch(e) {}
    })();
  `;
  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
};

export default PreloadScript;
