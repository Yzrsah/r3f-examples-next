const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')

const debug = true

const match = (() => {
  let start = null
  let i = 0

  return (path) => {
    if (
      path.includes('three/examples/jsm') || //
      path.includes('@react-three/drei') // ||
      // path.includes('react-spring')
    ) {
      if (debug) {
        // should be around 3/4 seconds the first time and then 200ms after using Webpack 5 built-in loader cache
        let end = start ? new Date() - start : 0
        console.log(`\x1b[37m`, `🚄 ${end}ms - The transpilation ${path} in process`)
        if (i === 1) {
          start = new Date()
        }
        i++
      }

      return true
    }

    return false
  }
})()

const withTM = require('next-transpile-modules')(
  [
    'three',
    '@react-three/drei',
    // 'react-spring',
  ],
  {
    debug: debug,
    __unstable_matcher: match,
  }
)

const nextConfig =
  process.env.EXPORT !== 'true'
    ? {
        // future: {
        //   webpack5: true,
        // },
        webpack: (config) => {
          config.module.rules.push(
            { test: /react-spring/, sideEffects: true }, // prevent vercel to crash when deploy
            // {
            //   test: /\.(glsl|vs|fs|vert|frag)$/,
            //   exclude: /node_modules/,
            //   use: ['raw-loader', 'glslify-loader'],
            // },
            {
              test: /\.(glb|gltf|blob)$/,
              exclude: /node_modules/, // I added
              use: {
                loader: 'file-loader',
                options: {
                  outputPath: 'static/images/',
                  publicPath: '/_next/static/images',
                },
              },
            }
          )
          return config
        },
        // reactStrictMode: true,
      }
    : {
        // needed because config breaks with next export
      }

module.exports = withPlugins(
  [
    //
    [withTM(nextConfig)],
    [withImages],
  ],
  nextConfig
)
