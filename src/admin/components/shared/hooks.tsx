import { useEffect, useState } from "react";
import { useAdminCustomQuery, useAdminCustomPost, useAdminCustomDelete } from "medusa-react";


// Custom hooks for onboarding state
const useAdminOnboardingState = (onboardingStateId) => {
  // Ensure queryKey is an array
  return useAdminCustomQuery(`/onboarding/${onboardingStateId}`, [`onboarding-${onboardingStateId}`]);
};

const useAdminUpdateOnboardingStateMutation = () => {
  // Ensure queryKey is an array
  return useAdminCustomPost(`/onboarding`, [`onboarding-update`]);
};

// Custom hooks for product media
const useAdminProductMedia = (mediaId) => {
  // Ensure queryKey is an array
  return useAdminCustomQuery(`/product-media/${mediaId}`, [`product-media-${mediaId}`]);
};

const useAdminProductMedias = () => {
  // Ensure queryKey is an array
  return useAdminCustomQuery(`/product-medias`, [`product-medias`]);
};

const useAdminCreateProductMediaMutation = () => {
  // Ensure queryKey is an array
  return useAdminCustomPost(`/product-media`, [`product-media-create`]);
};

const useAdminDeleteProductMediaMutation = () => {
  // Ensure queryKey is an array
  return useAdminCustomDelete(`/product-media`, [`product-media-delete`]);
};

const useAdminUpdateProductMediaMutation = () => {
  // Ensure queryKey is an array
  return useAdminCustomPost(`/product-media`, [`product-media-update`]);
};

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return dimensions;
};

export {
  useWindowDimensions,
  useAdminCreateProductMediaMutation,
  useAdminDeleteProductMediaMutation,
  useAdminOnboardingState,
  useAdminProductMedia,
  useAdminProductMedias,
  useAdminUpdateOnboardingStateMutation,
  useAdminUpdateProductMediaMutation,
};
