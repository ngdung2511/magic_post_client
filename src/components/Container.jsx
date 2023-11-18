/* eslint-disable react/prop-types */
const Container = ({ children }) => {
  return (
    <div className="w-full h-full px-4 md:px-6 xl:px-8 max-w-7xl">
      {children}
    </div>
  );
};

export default Container;
