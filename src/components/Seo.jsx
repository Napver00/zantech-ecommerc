import { Helmet } from "react-helmet-async";

const Seo = ({
  title,
  description,
  image,
  url,
  type = "website",
  product,
  keywords,
}) => {
  const baseURL = "https://store.zantechbd.com";
  const siteName = "Zantech Store";

  const defaultTitle =
    "Zantech Store - Robotics and IoT Solutions in Bangladesh";
  const defaultDescription =
    "Buy Arduino Uno, ESP32, Raspberry Pi, robotics kits, sensors, and electronics components in Bangladesh. Innovation starter kits, competition robot kits, IoT modules, and DIY electronics for students, hobbyists, and engineers. Fast delivery across Dhaka, Chittagong, Sylhet.";
  const defaultImage = `${baseURL}/zantech-logo.webp`;
  const defaultKeywords =
    "Arduino Bangladesh, ESP32 Bangladesh, robotics kit Bangladesh, Arduino Uno price Bangladesh, electronics components Bangladesh, Raspberry Pi Bangladesh, innovation kit, competition robot kit, IoT modules, sensors Bangladesh, starter kit electronics, DIY electronics BD, robotics equipment Dhaka, microcontroller Bangladesh, maker kit, STEM education kit";

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || baseURL;
  const seoKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Zantech BD" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_BD" />

      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />

      {/* Geo Tags */}
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Bangladesh" />

      {/* Product Specific Meta Tags */}
      {product && (
        <>
          <meta property="product:price:amount" content={String(product.price)} />
          <meta
            property="product:price:currency"
            content={product.currency || "BDT"}
          />
          {product.availability && (
            <meta
              property="product:availability"
              content={product.availability}
            />
          )}
          {product.condition && (
            <meta
              property="product:condition"
              content={product.condition || "new"}
            />
          )}
          {product.brand && (
            <meta property="product:brand" content={product.brand} />
          )}

          {/* Product Schema for Google */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: title,
              image: seoImage,
              description: seoDescription,
              brand: {
                "@type": "Brand",
                name: product.brand || "Zantech Store",
              },
              offers: {
                "@type": "Offer",
                url: seoUrl,
                priceCurrency: product.currency || "BDT",
                price: product.price,
                availability: `https://schema.org/${
                  product.availability === "in stock" ? "InStock" : "OutOfStock"
                }`,
                seller: {
                  "@type": "Organization",
                  name: "Zantech Store",
                },
              },
            })}
          </script>
        </>
      )}
    </Helmet>
  );
};

export default Seo;
