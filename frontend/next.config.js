module.exports = {
  reactStrictMode: true,
  distDir: 'dist',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // images: {
  //   domains: ['i6a502.p.ssafy.io'],
  // },

  // swcMinify: true,
  // swcMinify : Rust 컴파일러로 변경 -> 속도 빨라짐
  // experimental: {
  //   // experimental : Component 레벨에서 동작하는 모든 것을 서버 단에서 처리
  //   // useEffect() 내에서 처리해야 하는 것들 -> 서버 단에서 처리
  //   concurrentFeatures: true,
  //   serverComponents: true
  // }
};
