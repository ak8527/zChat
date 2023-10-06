import ZipSvg from '../../components/Svg/ZipSvg';
import FileSvg from '../../components/Svg/FileSvg';
import AudioSvg from '../../components/Svg/AudioSvg';
import VideoSvg from '../../components/Svg/VideoSvg';

const FileTypeSvg = ({ mimetype }) => {
  if (mimetype.includes('video')) return <VideoSvg />;
  else if (mimetype.includes('audio')) return <AudioSvg />;
  else if (
    mimetype.includes('zip') ||
    mimetype.includes('rar') ||
    mimetype.includes('tar')
  )
    return <ZipSvg />;
  else return <FileSvg />;
};

export default FileTypeSvg;
