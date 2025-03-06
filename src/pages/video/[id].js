import VideoPlayer from "../../components/templates/VideoPlayer";
import { useRouter } from "next/router";

export default function VideoPlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  return <VideoPlayer id={id} />;
}
