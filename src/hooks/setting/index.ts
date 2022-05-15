import type { GlobConfig } from '/#/config';

// import { warn } from '@/utils/log';
import { getAppEnvConfig } from '@/utils/env';
 
export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    // VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_IMG_URL,
  } = getAppEnvConfig();

  console.log('------------setting-index------');
  console.log(VITE_GLOB_API_URL);
  console.log(VITE_GLOB_APP_SHORT_NAME);
  console.log(VITE_GLOB_API_URL_PREFIX);
  console.log(VITE_GLOB_UPLOAD_URL);
  
  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    console.warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    // title: VITE_GLOB_APP_TITLE,
    title: VITE_GLOB_APP_SHORT_NAME,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    imgUrl: VITE_GLOB_IMG_URL,
  };

  console.log('------------setting-index-glob-----');
  console.log(glob);
  
  return glob as Readonly<GlobConfig>;
};
