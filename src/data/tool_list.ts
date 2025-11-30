export interface Tool {
  id: number
  title: string
  description: string
  icon: string
  url: string
  categories: string[]
}
export const TOOL_LIST: Tool[] = [
  {
    id: 1,
    title: "Image Resize & Compressor",
    description: "Optimize and resize your images with advanced compression algorithms.",
    icon: "🖼️",
    url: "https://img-utils.netlify.app",
    categories: ["Image", "Utility"],
  },
  {
    id: 2,
    title: "Youtube Video Cropper",
    description: "Trim the start and end points of your MP4 videos quickly.",
    icon: "🎬",
    url: "https://yt-cutter-2loj.onrender.com/",
    categories: ["Video", "Editing"],
  }
]