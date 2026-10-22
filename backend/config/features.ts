import type { Core } from '@strapi/strapi';
export default ({ env }: Core.Config.Shared.ConfigParams) => ({
  useLegacyMediaLibrary: env.bool('USE_LEGACY_MEDIA_LIBRARY', true),
});