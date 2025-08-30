import { getProjects } from '../../lib/contentful';
import VideoPlayer from '../archive/[slug]/VideoPlayer';

export default async function TestVideoPage() {
  const projects = await getProjects();
  
  // Find a project with a Vimeo ID
  const projectWithVideo = projects.find(p => p.vimeoId);
  
  if (!projectWithVideo) {
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-2xl font-bold mb-4">No Video Projects Found</h1>
        <p>No projects with Vimeo IDs were found.</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Available Projects:</h2>
          <div className="space-y-2">
            {projects.slice(0, 10).map((project) => (
              <div key={project.id} className="p-3 bg-gray-100 rounded">
                <strong>{project.title}</strong> by {project.artist}
                <br />
                <span className="text-sm text-gray-600">
                  ID: {project.id} | Vimeo: {project.vimeoId || 'None'} | YouTube: {project.videoUrl || project.youtubeUrl || 'None'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Project Data:</h2>
          <div className="mt-2 p-4 bg-gray-100 rounded text-sm">
            <p><strong>ID:</strong> {projectWithVideo.id}</p>
            <p><strong>Title:</strong> {projectWithVideo.title}</p>
            <p><strong>Artist:</strong> {projectWithVideo.artist}</p>
            <p><strong>Vimeo ID:</strong> {projectWithVideo.vimeoId || 'None'}</p>
            <p><strong>Video URL:</strong> {projectWithVideo.videoUrl || 'None'}</p>
            <p><strong>YouTube URL:</strong> {projectWithVideo.youtubeUrl || 'None'}</p>
            <p><strong>Thumbnail:</strong> {projectWithVideo.thumbnail || 'None'}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Video Player Test:</h2>
          <p>Testing with project: <strong>{projectWithVideo.title}</strong> by <strong>{projectWithVideo.artist}</strong></p>
          <p>Vimeo ID: <code className="bg-gray-200 px-2 py-1 rounded">{projectWithVideo.vimeoId}</code></p>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Direct Vimeo Test:</h2>
          <p>If the VideoPlayer doesn&apos;t work, here&apos;s a direct Vimeo embed:</p>
          <div className="mt-2 w-full h-64 bg-gray-200 rounded overflow-hidden">
            <iframe
              src={`https://player.vimeo.com/video/${projectWithVideo.vimeoId}?autoplay=0&loop=1&title=0&byline=0&portrait=0&controls=1&background=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={projectWithVideo.title}
            />
          </div>
        </div>
      </div>
      
      {/* Test the VideoPlayer component */}
      <div className="w-full h-screen">
        <VideoPlayer 
          project={projectWithVideo}
          displayTitle={projectWithVideo.title}
          displayCreator={projectWithVideo.artist}
          displayIndex={1}
        />
      </div>
    </div>
  );
}
