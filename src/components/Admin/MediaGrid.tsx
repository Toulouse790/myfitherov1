interface MediaGridProps {
  mediaUrls: string[];
  onDelete: (url: string, exerciseName: string, type: 'image' | 'video') => void;
  exerciseName: string;
  type: 'image' | 'video';
}

export const MediaGrid = ({ mediaUrls, onDelete, exerciseName, type }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {mediaUrls.map((url, index) => (
        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
          {type === 'image' ? (
            <img
              src={url}
              alt={`${exerciseName} - ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full h-full object-cover"
            />
          )}
          <button
            onClick={() => onDelete(url, exerciseName, type)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};