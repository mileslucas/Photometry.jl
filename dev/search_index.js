var documenterSearchIndex = {"docs":
[{"location":"background/index.html#Background-Estimation-1","page":"Getting Started","title":"Background Estimation","text":"","category":"section"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"The module provides tools and algorithms for estimating the background of astronomical data.","category":"page"},{"location":"background/index.html#Usage-1","page":"Getting Started","title":"Usage","text":"","category":"section"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"Estimating backgrounds is an important step in performing photometry. Ideally, we could perfectly describe the background with a scalar value or with some distribution. Unfortunately, it's impossible for us to precisely separate the background and foreground signals. Here, we use mixture of robust statistical estimators and meshing to let us get the spatially varying background from an astronomical photo.","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"Let's show an example","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"using Photometry\nusing FITSIO\nusing Plots\n\n# Download our image, courtesy of astropy\nhdu = FITS(download(\"https://github.com/astropy/photutils-datasets/raw/master/data/M6707HH.fits\"))\nimage = read(hdu[1])'\n\ndefault(aspect_ratio=1, xlims=(1, size(image, 2)), ylims=(1, size(image, 1)))\n\nheatmap(image)\nsavefig(\"m67_full.png\"); nothing # hide","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"Now let's try and estimate the background using estimate_background. First, we'll si gma-clip to try and remove the signals from the stars. Then, the background is broken down into meshes, in this case of size (50, 50). Within each mesh, the given statistical estimators get the background value and RMS. By default, we use SourceExtractorBackground and StdRMS. This creates a low-resolution image, which we then need to resize. We can accomplish this using an interpolator, by default a cubic-spline interpolator via ZoomInterpolator. The end result is a smooth estimate of the spatially varying background and background RMS.","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"# sigma-clip\nclipped = sigma_clip(image, 1, fill=NaN)\n\n# get background and background rms with mesh-size (50, 50)\nbkg, bkg_rms = estimate_background(clipped, 50)\n\n# plot\nplot(layout=(2, 2), size=(800, 800), link=:all)\nheatmap!(image,   title=\"Original\",       subplot=1)\nheatmap!(clipped, title=\"Sigma-Clipped\",  subplot=2)\nheatmap!(bkg,     title=\"Background\",     subplot=3)\nheatmap!(bkg_rms, title=\"Background RMS\", subplot=4)\n\nsavefig(\"bkg.png\"); nothing # hide","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"and now we can see our image with the background subtracted and ready for Aperture Photometry!","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"subt = image .- bkg[:1059, :1059]\nplot(layout=(1, 2), link=:all, size=(800, 350), xlims=(400, 800), ylims=(400, 800))\nheatmap!(image, title=\"Original\",   subplot=1)\nheatmap!(subt,  title=\"Subtracted\", subplot=2)\n\nsavefig(\"bkg_final.png\"); nothing # hide","category":"page"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"background/index.html#API/Reference-1","page":"Getting Started","title":"API/Reference","text":"","category":"section"},{"location":"background/index.html#","page":"Getting Started","title":"Getting Started","text":"estimate_background\nsigma_clip\nsigma_clip!","category":"page"},{"location":"background/index.html#Photometry.Background.estimate_background","page":"Getting Started","title":"Photometry.Background.estimate_background","text":"estimate_background(data,\n    ::BackgroundEstimator=SourceExtractorBackground,\n    ::BackgroundRMSEstimator=StdRMS;\n    dims=:)\n\nPerform scalar background estimation using the given estimators.\n\nThe value returned will be two values corresponding to the estimated background and the estimated background RMS. The dimensionality will depend on the dims keyword.\n\nIf the background estimator has no parameters (like MeanBackground), you can just specify the type without construction.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> bkg, bkg_rms = estimate_background(data)\n(1.0, 0.0)\n\njulia> bkg, bkg_rms = estimate_background(data, BiweightLocationBackground, BiweightScaleRMS)\n(1.0, 0.0)\n\nSee Also\n\nLocation Estimators\nRMS Estimators\n\n\n\n\n\nestimate_background(data,\n    mesh_size,\n    ::BackgroundEstimator=SourceExtractorBackground(),\n    ::BackgroundRMSEstimator=StdRMS(),\n    ::BackgroundInterpolator=ZoomInterpolator(mesh_size);\n    edge_method=:pad)\n\nPerform 2D background estimation using the given estimators using meshes.\n\nThis function will estimate backgrounds in meshes of size mesh_size. When size(data) is not an integer multiple of the mesh size, there are two edge methods: :pad and :crop. The default is to pad (and is recommend to avoid losing image data).\n\nIf either size is an integer, the implicit shape will be square (eg. box_size=4 is equivalent to box_size=(4,4)). Contrast this to a single dimension size, like box_size=(4,).\n\nOnce the meshes are created they will be passed to the BackgroundInterpolator to recreate a low-order estimate of the background at the same resolution as the input.\n\nSee Also\n\nLocation Estimators\nRMS Estimators\nInterpolators\n\n\n\n\n\n","category":"function"},{"location":"background/index.html#Photometry.Background.sigma_clip","page":"Getting Started","title":"Photometry.Background.sigma_clip","text":"sigma_clip(x, sigma; fill=:clamp, center=median(x), std=std(x, corrected=false))\nsigma_clip(x, sigma_low, sigma_high; fill=:clamp, center=median(x), std=std(x, corrected=false))\n\nThis function returns sigma-clipped values of the input x.\n\nSpecify the upper and lower bounds with sigma_low and sigma_high, otherwise assume they are equal. center and std are optional keyword arguments which are functions for finding central element and standard deviation.\n\nIf fill === :clamp, this will clamp values in x lower than center - sigma_low * std and values higher than center + sigma_high * std. Otherwise, they will be replaced with fill.\n\nExamples\n\njulia> x = randn(100_000);\n\njulia> extrema(x)\n(-4.387579729097121, 4.518192547139076)\n\njulia> x_clip = sigma_clip(x, 1);\n\njulia> extrema(x_clip) # should be close to (-1, 1)\n(-1.0021043865183705, 1.0011542162690115)\n\n\n\n\n\n","category":"function"},{"location":"background/index.html#Photometry.Background.sigma_clip!","page":"Getting Started","title":"Photometry.Background.sigma_clip!","text":"sigma_clip!(x, sigma; fill=:clamp, center=median(x), std=std(x))\nsigma_clip!(x, sigma_low, sigma_high; fill=:clamp, center=median(x), std=std(x))\n\nIn-place version of sigma_clip\n\nwarning: Warning\nsigma_clip! mutates the element in place and mutation cannot lead to change in type. Please be considerate of your input type, because if you are using Int64 and we try to clip it to 0.5 an InexactError will be thrown.To avoid this, we recommend converting to float before clipping, or using sigma_clip which does this internally.\n\n\n\n\n\n","category":"function"},{"location":"apertures/examples.html#Examples-1","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"apertures/examples.html#Plotting-1","page":"Examples","title":"Plotting","text":"","category":"section"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"We have recipes for all our aperture types, so you can easily create overlays on your images.","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"using Photometry\nusing Plots\n\nplot(CircularAperture(2, 3, 4), c=1, xlims=(-1, 12), ylims=(0, 9))\nplot!(CircularAnnulus(5, 5, 2.1, 3), c=2)\nplot!(EllipticalAperture(0, 0, 10, 1, 32), c=3)\nplot!(EllipticalAnnulus(5, 5, 4, 5, 2, -32), c=4)\nplot!(RectangularAperture(0, 0, 4, 4, 4), c=5)\nplot!(RectangularAnnulus(5, 1, 3, 4, 4, 4), c=6)\n\nsavefig(\"apertures.png\"); nothing # hide","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"apertures/examples.html#Simple-Stars-1","page":"Examples","title":"Simple Stars","text":"","category":"section"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"Here is an example where we will find aperture fluxes for stars from M67. The dataset is provided as part of the astropy/photutils-datasets repository.","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"Let's start by downloading and showing our image","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"using Photometry\nusing Plots\nusing FITSIO\n\nhdu = FITS(download(\"https://github.com/astropy/photutils-datasets/raw/master/data/M6707HH.fits\"))\nimage = read(hdu[1])'\nchunk = @view image[71:150, 81:155]\n\nheatmap(chunk, aspect_ratio=1, c=:inferno,\n    xlims=(1, size(chunk, 2)), ylims=(1, size(chunk, 1)))\nsavefig(\"m67.png\"); nothing # hide","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"Now let's add some apertures!","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"positions = [\n    [47.5, 67.5],\n    [29.5, 62.5],\n    [23.5, 48.5],\n    [17.5, 29.5],\n    [13.5, 10.5],\n    [65.5, 14.0]\n]\n\nradii = [3, 3, 2.7, 2, 2.7, 3]\n\naps = CircularAperture.(positions, radii)","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"now let's plot them up","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"heatmap(chunk, aspect_ratio=1, c=:inferno,\n    xlims=(1, size(chunk, 2)), ylims=(1, size(chunk, 1)))\nplot!.(aps, c=:white)\nsavefig(\"m67_aps.png\"); nothing # hide","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"and finally let's get our output table for the photometry","category":"page"},{"location":"apertures/examples.html#","page":"Examples","title":"Examples","text":"table = aperture_photometry(aps, chunk)","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"DocTestSetup = :(using Photometry)","category":"page"},{"location":"apertures/apertures.html#Apertures-1","page":"Apertures","title":"Apertures","text":"","category":"section"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"All apertures will rely on a position and the shape parameters.","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"aperture = Aperture(x0, y0, shape_params...)","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"The position can be pixels or sky coordinates. The sky coordinate positions utilize SkyCoords.jl and WCS.jl for conversion.","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"warning: Warning\nSky coordinates are not supported yet.","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"note: Note\nSee Pixel Convention - The origin is the bottom-left with (1, 1) being the center of the pixel.","category":"page"},{"location":"apertures/apertures.html#Circular-Apertures-1","page":"Apertures","title":"Circular Apertures","text":"","category":"section"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by radius.","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"CircularAperture\nCircularAnnulus","category":"page"},{"location":"apertures/apertures.html#Photometry.Aperture.CircularAperture","page":"Apertures","title":"Photometry.Aperture.CircularAperture","text":"CircularAperture(x, y, r)\nCircularAperture(position, r)\n\nA circular aperture.\n\nA circular aperture with radius r. r must be greater than or equal to 0.\n\nExamples\n\njulia> ap = CircularAperture(0, 0, 10)\nCircularAperture(0, 0, r=10)\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Photometry.Aperture.CircularAnnulus","page":"Apertures","title":"Photometry.Aperture.CircularAnnulus","text":"CircularAnnulus(x, y, r_in, r_out)\nCircularAnnulus(position, r_in, r_out)\n\nA circular annulus with inner radius r_in and outer radius r_out. 0 ≤ r_in ≤ r_out.\n\nExamples\n\njulia> ap = CircularAnnulus(0, 0, 5, 10)\nCircularAnnulus(0, 0, r_in=5, r_out=10)\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Elliptical-Apertures-1","page":"Apertures","title":"Elliptical Apertures","text":"","category":"section"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by the semi-major axis a, semi-minor axis b and position angle in degrees counter-clockwise from the positive x-axis θ","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"EllipticalAperture\nEllipticalAnnulus","category":"page"},{"location":"apertures/apertures.html#Photometry.Aperture.EllipticalAperture","page":"Apertures","title":"Photometry.Aperture.EllipticalAperture","text":"EllipticalAperture(x, y, a, b, θ)\nEllipticalAperture(position, a, b, θ)\n\nAn elliptical aperture with semi-major axis a, semi-minor axis b, and position angle θ. a and b must be ≥ 0, θ is measured in degrees counter-clockwise the standard x-axis.\n\nExamples\n\njulia> ap = EllipticalAperture(0, 0, 4, 2, 35)\nEllipticalAperture(0, 0, a=4, b=2, θ=35°)\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Photometry.Aperture.EllipticalAnnulus","page":"Apertures","title":"Photometry.Aperture.EllipticalAnnulus","text":"EllipticalAnnulus(x, y, a_in, a_out, b_out, θ)\nEllipticalAnnulus(position, a_in, a_out, b_out, θ)\n\nAn elliptical annulus with inner semi-major axis a_in, outer semi-major axis a_out, outer semi-minor axis b_out, and position angle θ. a_out ≥ a_in ≥ 0 and b_out must be ≥ 0, θ is measured in degrees counter-clockwise the standard x-axis.\n\nb_in will automatically be calculated from (a_in / a_out) * b_out. Note this may cause a type instability.\n\nExamples\n\njulia> ap = EllipticalAnnulus(0, 0, 4, 10, 5, 45)\nEllipticalAnnulus(0.0, 0.0, a_in=4.0, a_out=10.0, b_in=2.0, b_out=5.0, θ=45.0°)\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Rectangular-Apertures-1","page":"Apertures","title":"Rectangular Apertures","text":"","category":"section"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by width w, height h, and position angle in degrees counter-clockwise from the positive x-axis θ.","category":"page"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"RectangularAperture\nRectangularAnnulus","category":"page"},{"location":"apertures/apertures.html#Photometry.Aperture.RectangularAperture","page":"Apertures","title":"Photometry.Aperture.RectangularAperture","text":"RectangularAperture(x, y, w, h, θ)\nRectangularAperture(position, w, h, θ)\n\nA rectangular aperture.\n\nA rectangular aperture with width w, height h, and position angle θ in degrees.\n\nExamples\n\njulia> ap = RectangularAperture(0, 0, 10, 4, 0)\nRectangularAperture(0, 0, w=10, h=4, θ=0°)\n\nwarning: Warning\nThe :exact method is not implemented for RectangularAperture\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Photometry.Aperture.RectangularAnnulus","page":"Apertures","title":"Photometry.Aperture.RectangularAnnulus","text":"RectangularAnnulus(x, y, w_in, w_out, h_out, θ)\nRectangularAnnulus(position, w_in, w_out, h_out, θ)\n\nA rectangular annulus with inner width w_in, outer width w_out, outer height h_out, and position angle θ in degrees. h_in is automatically calculated from w_in / w_out * h_out. Note that w_out ≥ w_in > 0.\n\nExamples\n\njulia> ap = RectangularAnnulus(0, 0, 5, 10, 8, 45)\nRectangularAnnulus(0.0, 0.0, w_in=5.0, w_out=10.0, h_in=4.0, h_out=8.0, θ=45.0°)\n\nwarning: Warning\nThe :exact method is not implemented for RectangularAnnulus\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#API/Reference-1","page":"Apertures","title":"API/Reference","text":"","category":"section"},{"location":"apertures/apertures.html#","page":"Apertures","title":"Apertures","text":"Aperture.AbstractAperture\nmask\ncutout","category":"page"},{"location":"apertures/apertures.html#Photometry.Aperture.AbstractAperture","page":"Apertures","title":"Photometry.Aperture.AbstractAperture","text":"The abstract super-type for Apertures\n\n\n\n\n\n","category":"type"},{"location":"apertures/apertures.html#Photometry.Aperture.mask","page":"Apertures","title":"Photometry.Aperture.mask","text":"mask(::AbstractAperture; method=:exact)\n\nReturn an array of the weighting of the aperture in the minimum bounding box. For an explanation of the different methods, see aperture_photometry.\n\n\n\n\n\n","category":"function"},{"location":"apertures/apertures.html#Photometry.Aperture.cutout","page":"Apertures","title":"Photometry.Aperture.cutout","text":"cutout(::AbstractAperture, data)\n\nGet the cutout of the aperture from the data. This will handle partial overlap by padding the data with zeros.\n\n\n\n\n\n","category":"function"},{"location":"background/estimators.html#Background-Estimators-1","page":"Background Estimators","title":"Background Estimators","text":"","category":"section"},{"location":"background/estimators.html#","page":"Background Estimators","title":"Background Estimators","text":"All of these estimators are subtypes of Background.BackgroundEstimator or Background.BackgroundRMSEstimator and are derived using various statistical and image processing methods.","category":"page"},{"location":"background/estimators.html#Location-Estimators-1","page":"Background Estimators","title":"Location Estimators","text":"","category":"section"},{"location":"background/estimators.html#","page":"Background Estimators","title":"Background Estimators","text":"These estimators are used for estimating the background using some form of a central statistic.","category":"page"},{"location":"background/estimators.html#","page":"Background Estimators","title":"Background Estimators","text":"Background.BackgroundEstimator\nMeanBackground\nMedianBackground\nModeBackground\nMMMBackground\nSourceExtractorBackground\nBiweightLocationBackground","category":"page"},{"location":"background/estimators.html#Photometry.Background.BackgroundEstimator","page":"Background Estimators","title":"Photometry.Background.BackgroundEstimator","text":"Background.BackgroundEstimator\n\nThis abstract type embodies the possible background estimation algorithms for dispatch with estimate_background.\n\nTo implement a new estimator, you must define the struct and define a method like (::MyEstimator)(data::AbstractArray; dims=:).\n\nSee Also\n\nLocation Estimators\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.MeanBackground","page":"Background Estimators","title":"Photometry.Background.MeanBackground","text":"MeanBackground\n\nThis estimator returns the mean of the input.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> MeanBackground()(data)\n1.0\n\njulia> MeanBackground()(data, dims=1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.MedianBackground","page":"Background Estimators","title":"Photometry.Background.MedianBackground","text":"MedianBackground\n\nThis estimator returns the median of the input.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> MedianBackground()(data)\n1.0\n\njulia> MedianBackground()(data, dims=1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.ModeBackground","page":"Background Estimators","title":"Photometry.Background.ModeBackground","text":"ModeBackground\n\nThis estimator returns the mode of the input.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> ModeBackground()(data)\n1.0\n\njulia> ModeBackground()(data, dims=1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.MMMBackground","page":"Background Estimators","title":"Photometry.Background.MMMBackground","text":"MMMBackground(median_factor=3, mean_factor=2)\n\nEstimate the background using a mode estimator of the form median_factor * median - mean_factor * mean. This algorithm is based on the MMMBackground routine originally implemented in DAOPHOT. MMMBackground uses factors of median_factor=3 and mean_factor=2 by default. This estimator assumes that contaminated sky pixel values overwhelmingly display positive departures from the true value.\n\nExamples\n\njulia> x = ones(3, 5);\n\njulia> MMMBackground()(x)\n1.0\n\njulia> MMMBackground(4, 3)(x, dims = 1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\nSee Also\n\nSourceExtractorBackground\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.SourceExtractorBackground","page":"Background Estimators","title":"Photometry.Background.SourceExtractorBackground","text":"SourceExtractorBackground\n\nThis estimator returns the background of the input using the SourceExtractorBackground algorithm.\n\nThe background is calculated using a mode estimator of the form (2.5 * median) - (1.5 * mean).\n\nIf (mean - median) / std > 0.3 then the median is used and if std = 0 then the mean is used.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> SourceExtractorBackground()(data)\n1.0\n\njulia> SourceExtractorBackground()(data, dims=1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.BiweightLocationBackground","page":"Background Estimators","title":"Photometry.Background.BiweightLocationBackground","text":"BiweightLocationBackground(c = 6.0, M = nothing)\n\nEstimate the background using the robust biweight location statistic.\n\nxi_biloc=M + fracsum_u_i1(x_i - M)(1 - u_i^2)^2sum_u_i1(1-u_i^2)^2\n\nu_i = frac(x_i - M)ccdottextMAD(x)\n\nWhere textMAD(x) is median absolute deviation of x.\n\nExamples\n\njulia> x = ones(3,5);\n\njulia> BiweightLocationBackground()(x)\n1.0\n\njulia> BiweightLocationBackground(5.5)(x; dims = 1)\n1×5 Array{Float64,2}:\n 1.0  1.0  1.0  1.0  1.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#RMS-Estimators-1","page":"Background Estimators","title":"RMS Estimators","text":"","category":"section"},{"location":"background/estimators.html#","page":"Background Estimators","title":"Background Estimators","text":"These estimators are used for estimating the root-mean-square (RMS) of the background using some form of a deviation statistic.","category":"page"},{"location":"background/estimators.html#","page":"Background Estimators","title":"Background Estimators","text":"Background.BackgroundRMSEstimator\nStdRMS\nMADStdRMS\nBiweightScaleRMS","category":"page"},{"location":"background/estimators.html#Photometry.Background.BackgroundRMSEstimator","page":"Background Estimators","title":"Photometry.Background.BackgroundRMSEstimator","text":"Background.BackgroundRMSEstimator\n\nThis abstract type embodies the possible background RMS estimation algorithms for dispatch with estimate_background.\n\nTo implement a new estimator, you must define the struct and define a method like (::MyRMSEstimator)(data::AbstractArray; dims=:).\n\nSee Also\n\nRMS Estimators\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.StdRMS","page":"Background Estimators","title":"Photometry.Background.StdRMS","text":"StdRMS\n\nUses the standard deviation statistic for background RMS estimation.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> StdRMS()(data)\n0.0\n\njulia> StdRMS()(data, dims=1)\n1×5 Array{Float64,2}:\n 0.0  0.0  0.0  0.0  0.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.MADStdRMS","page":"Background Estimators","title":"Photometry.Background.MADStdRMS","text":"MADStdRMS\n\nUses the standard median absolute deviation (MAD) statistic for background RMS estimation.\n\nThis is typically given as\n\nsigma approx 14826 cdot textMAD\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> MADStdRMS()(data)\n0.0\n\njulia> MADStdRMS()(data, dims=1)\n1×5 Array{Float64,2}:\n 0.0  0.0  0.0  0.0  0.0\n\n\n\n\n\n","category":"type"},{"location":"background/estimators.html#Photometry.Background.BiweightScaleRMS","page":"Background Estimators","title":"Photometry.Background.BiweightScaleRMS","text":"BiweightScaleRMS(c=9.0, M=nothing)\n\nUses the robust biweight scale statistic for background RMS estimation.\n\nThe biweight scale is the square root of the biweight midvariance. The biweight midvariance uses a tuning constant, c, and an optional initial guess of the central value M.\n\nzeta^2_biscl= fracnsum_u_i1(x_i - M)^2(1 - u_i^2)^4leftsum_u_i1(1-u_i^2)(1-5u_i^2)right^2\n\nu_i = frac(x_i - M)ccdottextMAD(x)\n\nWhere textMAD(x) is median absolute deviation of x.\n\nExamples\n\njulia> data = ones(3, 5);\n\njulia> BiweightScaleRMS()(data)\n0.0\n\njulia> BiweightScaleRMS(3.0)(data, dims=1)\n1×5 Array{Float64,2}:\n 0.0  0.0  0.0  0.0  0.0\n\n\n\n\n\n","category":"type"},{"location":"background/interpolators.html#Background-Interpolators-1","page":"Background Interpolators","title":"Background Interpolators","text":"","category":"section"},{"location":"background/interpolators.html#","page":"Background Interpolators","title":"Background Interpolators","text":"Background interpolators provide a method for converting low-resolution meshes into low-order high-resolution images.","category":"page"},{"location":"background/interpolators.html#","page":"Background Interpolators","title":"Background Interpolators","text":"Background.BackgroundInterpolator","category":"page"},{"location":"background/interpolators.html#Photometry.Background.BackgroundInterpolator","page":"Background Interpolators","title":"Photometry.Background.BackgroundInterpolator","text":"Background.BackgroundInterpolator\n\nThis abstract type embodies the different ways of converting a low-resolution mesh into a high-resolution image, especially for dispatch with estimate_background\n\nTo implement a new interpolation scheme, you must define the struct and define a method like (::MyInterpolator)(mesh)\n\nSee Also\n\nInterpolators\n\n\n\n\n\n","category":"type"},{"location":"background/interpolators.html#Interpolators-1","page":"Background Interpolators","title":"Interpolators","text":"","category":"section"},{"location":"background/interpolators.html#","page":"Background Interpolators","title":"Background Interpolators","text":"ZoomInterpolator","category":"page"},{"location":"background/interpolators.html#Photometry.Background.ZoomInterpolator","page":"Background Interpolators","title":"Photometry.Background.ZoomInterpolator","text":"ZoomInterpolator(factors)\n\nUse a cubic-spline interpolation scheme to increase resolution of a mesh.\n\nfactors represents the level of \"zoom\", so an input mesh of size (10, 10) with factors (2, 2) will have an output size of (20, 20). If only an integer is provided, it will be used as the factor for every axis.\n\nExamples\n\njulia> ZoomInterpolator(2)([1 0; 0 1])\n4×4 Array{Float64,2}:\n  1.0          0.75   0.25   -2.77556e-17\n  0.75         0.625  0.375   0.25\n  0.25         0.375  0.625   0.75\n -5.55112e-17  0.25   0.75    1.0\n\njulia> ZoomInterpolator(3, 1)([1 0; 0 1])\n6×2 Array{Float64,2}:\n  1.0          -2.77556e-17\n  1.0          -2.77556e-17\n  0.666667      0.333333\n  0.333333      0.666667\n -5.55112e-17   1.0\n -5.55112e-17   1.0\n\n\n\n\n\n\n","category":"type"},{"location":"index.html#","page":"Home","title":"Home","text":"CurrentModule = Photometry\nDocTestSetup = :(using Photometry)","category":"page"},{"location":"index.html#Photometry-1","page":"Home","title":"Photometry","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"(Image: Build Status) (Image: Coverage) (Image: License)","category":"page"},{"location":"index.html#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"To install from the REPL, enter Pkg-mode (])","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"pkg> add Photometry","category":"page"},{"location":"index.html#Getting-Started-1","page":"Home","title":"Getting Started","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"Here is a basic example to do some aperture photometry using CircularAperture and CircularAnnulus. The aperture_photometry function performs the photometry using a given method.","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"data = ones(100, 100)\nerr = ones(100, 100)\n\nap1 = CircularAperture(50, 50, 3)\n# partial overlap\nap2 = CircularAperture(0.5, 0.5, 5)\n\nresults = aperture_photometry([ap1, ap2], data, err)\n@assert results.aperture_sum[1] ≈ 9π\n@assert results.aperture_sum[2] ≈ 25π / 4\n\nresults\n\n# output\n2×4 DataFrames.DataFrame\n│ Row │ xcenter │ ycenter │ aperture_sum │ aperture_sum_err │\n│     │ Any     │ Any     │ Any          │ Any              │\n├─────┼─────────┼─────────┼──────────────┼──────────────────┤\n│ 1   │ 50      │ 50      │ 28.2743      │ 5.31736          │\n│ 2   │ 0.5     │ 0.5     │ 19.635       │ 4.43113          │","category":"page"},{"location":"index.html#Contributing-1","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"If you're interested in contributing, go ahead and check out the issues or make a pull request. If you add a new feature, please write appropriate unit tests for it and bump the package's minor version.","category":"page"},{"location":"index.html#License-1","page":"Home","title":"License","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"The work derived from astropy/photutils is BSD 3-clause and the work derived from kbarbary/sep is BSD 3-clause. All other work is considered MIT expat. Therefore this work as a whole is BSD 3-clause. LICENSE contains all licenses and any files using derived work are noted at the top of the file.","category":"page"},{"location":"apertures/index.html#Aperture-Photometry-1","page":"Getting Started","title":"Aperture Photometry","text":"","category":"section"},{"location":"apertures/index.html#Introduction-1","page":"Getting Started","title":"Introduction","text":"","category":"section"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"Aperture photometry uses Apertures to cut out and sum values in an image. A very basic mask might be a square of pixels at a certain position. We can model this as a matrix of ones and zeros like","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"[0 0 0 0 0\n 0 1 1 1 0\n 0 1 1 1 0\n 0 1 1 1 0\n 0 0 0 0 0]","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"If we have some data like","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"[7 9 6 0 8\n 8 5 8 7 9\n 5 6 2 2 7\n 9 7 3 4 1\n 7 8 0 9 8]","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"then the result of our aperture photometry looks like","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"[0 0 0 0 0     [7 9 6 0 8     [0 0 0 0 0\n 0 1 1 1 0      8 5 8 7 9      0 5 8 7 0\n 0 1 1 1 0  .*  5 6 2 2 7  =   0 6 2 2 0\n 0 1 1 1 0      9 7 3 4 1      0 7 3 4 0\n 0 0 0 0 0]     7 8 0 9 8]     0 0 0 0 0]\n\n sum(result) = 44","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"This module uses the above principal with common aperture shapes in a fast and precise manner, including exact overlaps between apertures and pixels.","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"The majority of the lifting is done with the aperture_photometry function with common shapes being described in Apertures. It is possible to create a custom aperture by sub-typing the Aperture.AbstractAperture class, although it may be easier to perform PSF photometry instead.","category":"page"},{"location":"apertures/index.html#Pixel-Convention-1","page":"Getting Started","title":"Pixel Convention","text":"","category":"section"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"Photometry.jl follows the same convention as FITS, WCS, IRAF, ds9, and SourceExtractorBackground with (1, 1) being the center on the bottom-left pixel. This means the exact bottom-left corner is at (0.5, 0.5). Pixels increase up and to the right until axis_length + 0.5.","category":"page"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"This is mostly in line with Julia's indexing, although it is important to remember that arrays are layed out in (y, x) due to the row-column interface. So the pixel at (34, 56) is at image[56, end-34].","category":"page"},{"location":"apertures/index.html#API/Reference-1","page":"Getting Started","title":"API/Reference","text":"","category":"section"},{"location":"apertures/index.html#","page":"Getting Started","title":"Getting Started","text":"aperture_photometry","category":"page"},{"location":"apertures/index.html#Photometry.Aperture.aperture_photometry","page":"Getting Started","title":"Photometry.Aperture.aperture_photometry","text":"aperture_photometry(::AbstractAperture, data::AbstractMatrix, [error]; method=:exact)\naperture_photometry(::AbstractVector{<:AbstractAperture}, data::AbstractMatrix, [error]; method=:exact)\n\nPerform aperture photometry on data given aperture(s). If error (the pixel-wise standard deviation) is provided, will calculate sum error. If a list of apertures is provided the output will be a DataFrame, otherwise a NamedTuple.\n\nMethods\n\n:exact - Will calculate the exact geometric overlap\n:center - Will only consider full-pixel overlap (equivalent to subpixel method with 1 subpixel)\n(:subpixel, n) - Use n^2 subpixels to calculate overlap\n\n\n\n\n\n","category":"function"}]
}
