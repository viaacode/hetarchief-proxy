import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

// Keep in sync with IMAGE_WIDTHS in hetarchief-client src/modules/shared/helpers/optimized-image-urls.ts
export const IMAGE_WIDTHS = [150, 320, 640, 960, 1280, 1920, 2560];

// Only images on our own asset servers can be resized, so the number of variants stays bounded
export const IMAGE_SOURCE_HOST_REGEX = /^assets(-int|-tst|-qas)?\.(hetarchief|viaa)\.be$/;

// Organisation logos on the viaa asset servers can change under the same url,
// CMS images on the hetarchief asset servers have a uuid in their name and never change
export const MUTABLE_IMAGE_SOURCE_HOST_REGEX = /\.viaa\.be$/;

export const IMAGE_CACHE_FOLDER = 'IMAGE_CACHE';

export const CACHE_CONTROL_IMMUTABLE = 'public, max-age=31536000, immutable';
export const CACHE_CONTROL_MUTABLE = 'public, max-age=86400';
export const CACHE_CONTROL_NO_STORE = 'no-store';

// Regenerate cached copies of mutable images (logos) when they are older than this
export const MUTABLE_IMAGE_MAX_AGE_MS = hoursToMilliseconds(7 * 24);

// In-memory caches (lru-cache ttl is in milliseconds)
export const CACHED_KEY_TTL_IMMUTABLE_MS = hoursToMilliseconds(7 * 24);
export const CACHED_KEY_TTL_MUTABLE_MS = hoursToMilliseconds(24);
export const FAILED_KEY_TTL_MS = minutesToMilliseconds(10);

export const IMAGOR_TIMEOUT_MS = 15_000;
