import OrbitingCircles from "./orbiting-circles";

export function OrbitingCirclesEffect() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-black md:shadow-xl">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        DecentraWork
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Icons.whatsapp />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <Icons.notion />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <Icons.googleDrive />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <Icons.gitHub />
      </OrbitingCircles>
    </div>
  );
}

const Icons = {
  gitHub: () => (
<svg data-name="86977684-12db-4850-8f30-233a7c267d11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000">
  <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775ca"/>
  <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff"/>
  <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#fff"/>
</svg>

  ),
  notion: () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="2000" height="2000"><path d="M1000,0c552.26,0,1000,447.74,1000,1000S1552.24,2000,1000,2000,0,1552.38,0,1000,447.68,0,1000,0" fill="#53ae94"/><path d="M1123.42,866.76V718H1463.6V491.34H537.28V718H877.5V866.64C601,879.34,393.1,934.1,393.1,999.7s208,120.36,484.4,133.14v476.5h246V1132.8c276-12.74,483.48-67.46,483.48-133s-207.48-120.26-483.48-133m0,225.64v-0.12c-6.94.44-42.6,2.58-122,2.58-63.48,0-108.14-1.8-123.88-2.62v0.2C633.34,1081.66,451,1039.12,451,988.22S633.36,894.84,877.62,884V1050.1c16,1.1,61.76,3.8,124.92,3.8,75.86,0,114-3.16,121-3.8V884c243.8,10.86,425.72,53.44,425.72,104.16s-182,93.32-425.72,104.18" fill="#fff"/></svg>
  ),
  openai: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
  googleDrive: () => (
<svg width="643" height="643" viewBox="0 0 643 643" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M187.281 330.743C189.714 328.311 193.014 326.946 196.454 326.946H513.851C519.633 326.946 522.527 333.937 518.437 338.024L455.72 400.691C453.287 403.123 449.987 404.489 446.547 404.489H129.15C123.368 404.489 120.474 397.497 124.564 393.41L187.281 330.743Z" fill="url(#paint0_linear)"/>
<path d="M187.281 96.6225C189.714 94.191 193.014 92.8252 196.454 92.8252H513.851C519.633 92.8252 522.527 99.8169 518.437 103.904L455.72 166.571C453.287 169.002 449.987 170.368 446.547 170.368H129.15C123.368 170.368 120.474 163.377 124.564 159.29L187.281 96.6225Z" fill="url(#paint1_linear)"/>
<path d="M455.72 212.937C453.287 210.506 449.987 209.14 446.547 209.14H129.15C123.368 209.14 120.474 216.132 124.564 220.218L187.281 282.886C189.714 285.317 193.014 286.683 196.454 286.683H513.851C519.633 286.683 522.527 279.691 518.437 275.604L455.72 212.937Z" fill="url(#paint2_linear)"/>
<path d="M138.832 528.631H160.556C163.608 528.631 166.081 531.139 166.081 534.233C166.081 537.326 163.608 539.834 160.556 539.834H134.353C133.944 539.834 133.549 539.982 133.238 540.252L125.326 547.114C124.115 548.164 124.848 550.175 126.442 550.175H159.244C159.257 550.175 159.268 550.164 159.268 550.151C159.268 550.136 159.28 550.125 159.295 550.126C159.707 550.159 160.125 550.175 160.546 550.175C169.247 550.175 176.301 543.038 176.301 534.233C176.301 525.872 169.94 519.014 161.848 518.344C161.834 518.343 161.823 518.331 161.823 518.317C161.823 518.302 161.811 518.29 161.797 518.29H138.393C135.342 518.29 132.868 515.783 132.868 512.689C132.868 509.595 135.342 507.088 138.393 507.088H164.56C164.991 507.088 165.406 506.923 165.722 506.627L173.069 499.765C174.218 498.692 173.469 496.747 171.906 496.747H138.832C138.831 496.747 138.829 496.748 138.829 496.749C138.829 496.751 138.828 496.752 138.826 496.752C138.686 496.748 138.545 496.747 138.403 496.747C129.702 496.747 122.648 503.884 122.648 512.689C122.648 521.494 129.702 528.631 138.403 528.631C138.545 528.631 138.686 528.63 138.826 528.626C138.828 528.626 138.829 528.627 138.829 528.629C138.829 528.63 138.831 528.631 138.832 528.631Z" fill="black"/>
<path d="M265.361 496.747C264.411 496.747 263.641 497.525 263.641 498.486V548.436C263.641 549.397 264.411 550.175 265.361 550.175H305.14C305.615 550.175 306.069 549.976 306.394 549.626L311.373 544.253C312.403 543.142 311.624 541.324 310.119 541.324H275.387C274.437 541.324 273.667 540.545 273.667 539.584V498.486C273.667 497.525 272.897 496.747 271.948 496.747H265.361Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M201.648 496.747C201.645 496.747 201.643 496.749 201.643 496.751C201.643 496.754 201.641 496.756 201.639 496.756C196.554 496.978 192.472 501.094 192.252 506.221C192.252 506.224 192.25 506.226 192.247 506.226C192.246 506.226 192.245 506.227 192.244 506.227C192.243 506.228 192.243 506.229 192.243 506.231V539.83C192.243 539.832 192.245 539.834 192.247 539.834C192.25 539.834 192.252 539.836 192.252 539.839C192.246 539.98 192.243 540.122 192.243 540.265C192.243 545.593 196.411 549.938 201.639 550.166C201.641 550.166 201.643 550.168 201.643 550.171L201.644 550.173L201.645 550.174C201.646 550.175 201.647 550.175 201.648 550.175H237.743C237.745 550.175 237.748 550.173 237.748 550.171L237.748 550.168L237.75 550.166L237.752 550.166C242.979 549.938 247.148 545.593 247.148 540.265C247.148 540.122 247.145 539.98 247.139 539.839C247.139 539.836 247.141 539.834 247.144 539.834C247.146 539.834 247.148 539.832 247.148 539.83V506.231C247.148 506.228 247.146 506.226 247.143 506.226C247.141 506.226 247.139 506.224 247.139 506.221C246.919 501.094 242.836 496.978 237.752 496.756C237.75 496.756 237.748 496.754 237.748 496.751C237.748 496.749 237.745 496.747 237.743 496.747H201.648ZM208.376 506.226L208.374 506.227L208.373 506.229C208.373 506.23 208.372 506.232 208.37 506.232C205.193 506.371 202.641 508.961 202.504 512.186C202.504 512.187 202.502 512.189 202.501 512.189C202.499 512.189 202.498 512.19 202.498 512.192V533.327C202.498 533.328 202.499 533.329 202.501 533.329C202.502 533.329 202.503 533.331 202.503 533.332C202.5 533.421 202.498 533.511 202.498 533.6C202.498 536.952 205.103 539.685 208.37 539.828C208.372 539.828 208.373 539.83 208.373 539.831L208.374 539.833L208.375 539.834L208.376 539.834H231.015L231.016 539.834L231.017 539.833L231.018 539.831C231.018 539.83 231.019 539.828 231.02 539.828C234.288 539.685 236.893 536.952 236.893 533.6C236.893 533.511 236.891 533.421 236.887 533.332L236.887 533.332L236.888 533.331L236.89 533.329C236.892 533.329 236.893 533.328 236.893 533.327V512.192C236.893 512.19 236.892 512.189 236.89 512.189C236.889 512.189 236.887 512.187 236.887 512.186C236.75 508.961 234.198 506.371 231.02 506.232C231.019 506.232 231.018 506.23 231.018 506.229L231.017 506.227L231.016 506.226L231.015 506.226H208.376Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M369.217 548.436C369.217 549.397 369.981 550.175 370.923 550.175H377.669C378.611 550.175 379.375 549.397 379.375 548.436V507.092C379.375 507.09 379.373 507.088 379.37 507.088L379.368 507.087L379.367 507.086C379.366 507.086 379.366 507.084 379.366 507.083C379.372 506.942 379.375 506.8 379.375 506.657C379.375 501.329 375.246 496.984 370.068 496.756C370.066 496.756 370.064 496.754 370.064 496.751C370.064 496.749 370.062 496.747 370.059 496.747H335.407C335.404 496.747 335.402 496.749 335.402 496.751C335.402 496.754 335.4 496.756 335.398 496.756C335.259 496.75 335.119 496.747 334.979 496.747C329.603 496.747 325.245 501.184 325.245 506.657C325.245 506.8 325.248 506.942 325.254 507.083C325.254 507.085 325.252 507.088 325.249 507.088C325.247 507.088 325.245 507.09 325.245 507.092V548.436C325.245 549.397 326.008 550.175 326.95 550.175H333.697C334.639 550.175 335.402 549.397 335.402 548.436V531.233C335.402 530.272 336.166 529.493 337.108 529.493H367.512C368.454 529.493 369.217 530.272 369.217 531.233V548.436ZM335.402 519.998V511.396C335.402 508.065 338.055 505.364 341.328 505.364H363.292C366.565 505.364 369.217 508.065 369.217 511.396V519.998C369.217 520.959 368.454 521.737 367.512 521.737H337.108C336.166 521.737 335.402 520.959 335.402 519.998Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M511.625 550.175C510.674 550.175 509.903 549.397 509.903 548.436V531.233C509.903 530.272 509.132 529.493 508.181 529.493H477.441C476.49 529.493 475.719 530.272 475.719 531.233V548.436C475.719 549.397 474.949 550.175 473.998 550.175H467.186C466.235 550.175 465.464 549.397 465.464 548.436V507.092L465.464 507.091L465.465 507.089C465.466 507.088 465.467 507.088 465.469 507.088C465.471 507.088 465.473 507.085 465.473 507.083C465.467 506.942 465.464 506.8 465.464 506.657C465.464 501.184 469.864 496.747 475.292 496.747C475.434 496.747 475.575 496.75 475.715 496.756C475.717 496.756 475.719 496.754 475.719 496.751C475.719 496.749 475.721 496.747 475.724 496.747L510.753 496.747C510.756 496.747 510.758 496.749 510.758 496.751C510.758 496.754 510.76 496.756 510.762 496.756C515.99 496.984 520.158 501.329 520.158 506.657C520.158 506.8 520.155 506.942 520.149 507.083C520.149 507.085 520.151 507.088 520.154 507.088C520.155 507.088 520.156 507.088 520.157 507.089C520.158 507.09 520.158 507.091 520.158 507.092V548.436C520.158 549.397 519.388 550.175 518.437 550.175H511.625ZM475.719 511.396V519.998C475.719 520.959 476.49 521.737 477.441 521.737H508.181C509.132 521.737 509.903 520.959 509.903 519.998V511.396C509.903 508.065 507.225 505.364 503.921 505.364H481.702C478.398 505.364 475.719 508.065 475.719 511.396Z" fill="black"/>
<path d="M404.768 496.747C405.268 496.747 405.742 496.97 406.066 497.357L436.323 533.651C437.352 534.881 439.326 534.139 439.326 532.522V498.486C439.326 497.525 440.089 496.747 441.031 496.747H447.778C448.72 496.747 449.483 497.525 449.483 498.486V548.436C449.483 549.397 448.72 550.175 447.778 550.175H439.39C439.354 550.175 439.326 550.146 439.326 550.11C439.326 550.095 439.32 550.079 439.31 550.068L408.546 514.028C407.509 512.817 405.555 513.565 405.555 515.172V548.436C405.555 549.397 404.792 550.175 403.85 550.175H397.06C396.118 550.175 395.355 549.397 395.355 548.436V498.486C395.355 497.525 396.118 496.747 397.06 496.747H404.768Z" fill="black"/>
<defs>
<linearGradient id="paint0_linear" x1="391.52" y1="7.33416" x2="171.854" y2="428.083" gradientUnits="userSpaceOnUse">
<stop stop-color="#00FFA3"/>
<stop offset="1" stop-color="#DC1FFF"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="391.52" y1="7.33416" x2="171.854" y2="428.083" gradientUnits="userSpaceOnUse">
<stop stop-color="#00FFA3"/>
<stop offset="1" stop-color="#DC1FFF"/>
</linearGradient>
<linearGradient id="paint2_linear" x1="391.52" y1="7.33416" x2="171.854" y2="428.083" gradientUnits="userSpaceOnUse">
<stop stop-color="#00FFA3"/>
<stop offset="1" stop-color="#DC1FFF"/>
</linearGradient>
</defs>
</svg>

  ),
  whatsapp: () => (
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
viewBox="0 0 4091.27 4091.73"
 >
 <g id="Layer_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <g id="_1421344023328">
   <path fill="#F7931A" fill-rule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"/>
   <path fill="white" fill-rule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"/>
  </g>
 </g>
</svg>

  ),
};
