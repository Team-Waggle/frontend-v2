import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const DEFAULT_DESCRIPTION = '여기를 눌러 링크를 확인하세요.';

const DEFAULT_IMAGE = 'https://waggle.lol/og_image.png';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
}: SEOProps) => {
  const fullTitle = title === 'Waggle' ? title : `Waggle 와글 | ${title}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Waggle" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Helmet>
  );
};

export default SEO;
