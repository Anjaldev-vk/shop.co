import React from "react";
import useBrands from "../../context/UseBrand";

const BrandSection = () => {
  const { brands, loading, error } = useBrands();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading brands!</p>;

  return (
    <div className="bg-black py-4 sm:py-6 md:py-8">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 px-4 sm:px-6 md:px-8">
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.logo}
            alt={brand.name}
            className="h-8 sm:h-10 md:h-12 filter invert object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSection;
