const DM_VIDEO_SERVER_URL = 'https://s7g10.scene7.com/is/content';
const DM_SERVER_URL = 'https://s7g10.scene7.com/is/image';
export function isAdobeCloud() {
    return window.location.origin.includes('adobeaemcloud.com');
}
export function createVideo(asset, block, cssClass) {
    return new Promise((resolve, reject) => {
        try {
            // Create the container for poster (and video if applicable)
            const videoContainer = document.createElement('div');
            videoContainer.id = "video-container";
            videoContainer.classList.add(cssClass);
            // Create the poster image element
            const posterOverlay = document.createElement('div');
            const imagePoster = document.createElement('img');
            imagePoster.src = `${DM_SERVER_URL}/eggsstage/${asset}?fit=constrain,&wid=1080&hei=720&qt=50`;
            posterOverlay.appendChild(imagePoster);
            // Append the poster to the container
            videoContainer.appendChild(posterOverlay);
            // If in Adobe Cloud editor, only show the poster and resolve the block
            if (isAdobeCloud()) {
                block.appendChild(videoContainer);
                resolve(block); // No video creation
                return;
            }
            // Create the video element if not in Adobe Cloud editor
            const videoURL = `${DM_VIDEO_SERVER_URL}/eggsstage/${asset}`;
            const videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.loop = !isSafari();
            videoElement.controls = false;
            videoElement.preload = isSafari() ? 'auto' : 'metadata';
            videoElement.setAttribute('playsinline', 'true'); // Safari desktop and iOS
            videoElement.setAttribute('webkit-playsinline', 'true'); // Older iOS versions
            const MIN_BUFFERED_PERCENTAGE = 40;
            // eslint-disable-next-line no-inner-declarations
            function handleVideoPlay() {
                const buffered = videoElement.buffered;
                const duration = videoElement.duration;
                // Check if enough of the video is buffered
                if (buffered.length > 0) {
                    const bufferedEnd = buffered.end(buffered.length - 1); // The end of the last buffered range
                    const bufferedPercentage = (bufferedEnd / duration) * 100;
                    if (bufferedPercentage >= MIN_BUFFERED_PERCENTAGE) {
                        // Enough video is buffered, so fade out poster and play video
                        posterOverlay.style.opacity = '0'; // Fade out poster
                        videoElement.autoplay = true;
                    }
                }
            }
            if (isSafari()) {
                videoElement.addEventListener('ended', () => {
                    videoElement.currentTime = 0; // Reset to the start of the video
                    videoElement.play(); // Play the video again without reloading
                });
            }
            videoElement.addEventListener('progress', handleVideoPlay);
            videoElement.addEventListener('canplay', handleVideoPlay);
            videoElement.addEventListener('canplaythrough', handleVideoPlay);
            // Append the video element only if not in Adobe Cloud
            videoContainer.appendChild(videoElement);
            // Append the container to the block
            block.appendChild(videoContainer);
            resolve(block);
        }
        catch (error) {
            reject(error);
        }
    });
}
export function isVideoLink(link) {
    const linkString = link.getAttribute('href');
    return linkString.endsWith('.mp4');
}
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
