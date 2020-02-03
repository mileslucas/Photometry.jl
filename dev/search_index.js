var documenterSearchIndex = {"docs":
[{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"DocTestSetup = :(using Photometry)","category":"page"},{"location":"apertures.html#Apertures-1","page":"Apertures","title":"Apertures","text":"","category":"section"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"All apertures will rely on a position and the shape parameters.","category":"page"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"aperture = Aperture(x0, y0, shape_params...)","category":"page"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"The position can be pixels or sky coordinates. The sky coordinate positions utilize SkyCoords.jl and WCS.jl for conversion. ","category":"page"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"note: Note\nThe pixel positions for these apertures follow traditional image position with 1-based indexing. This means the origin is at top-left and has index (0.5, 0.5) at the top-left corner and (1, 1) at the center.","category":"page"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"photometry","category":"page"},{"location":"apertures.html#Photometry.Aperture.photometry","page":"Apertures","title":"Photometry.Aperture.photometry","text":"photometry(::AbstractAperture, data::AbstractMatrix, [error]; method=:exact)\nphotometry(::AbstractVector{<:AbstractAperture}, data::AbstractMatrix, [error]; method=:exact)\n\nPerform aperture photometry on data given aperture(s). If error (the pixel-wise standard deviation) is provided, will calculate sum error. If a list of apertures is provided the output will be a DataFrame, otherwise a NamedTuple. \n\nAvailable Methods\n\n:exact - Will calculate the exact geometric overlap\n:center - Will only consider full-pixel overlap (equivalent to subpixel method with 1 subpixel)\n(:subpixel, n) - Use n^2 subpixels to calculate overlap\n\n\n\n\n\n","category":"function"},{"location":"apertures.html#Circular-Apertures-1","page":"Apertures","title":"Circular Apertures","text":"","category":"section"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by radius.","category":"page"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"CircularAperture\nCircularAnnulus","category":"page"},{"location":"apertures.html#Photometry.Aperture.CircularAperture","page":"Apertures","title":"Photometry.Aperture.CircularAperture","text":"CircularAperture(x, y, r)\nCircularAperture([x, y], r)\n\nA circular aperture.\n\nExamples\n\njulia> ap = CircularAperture(0, 0, 10)\nCircularAperture(0, 0, r=10)\n\n\n\n\n\n\n","category":"type"},{"location":"apertures.html#Photometry.Aperture.CircularAnnulus","page":"Apertures","title":"Photometry.Aperture.CircularAnnulus","text":"CircularAnnulus(x, y, r_in, r_out)\nCircularAnnulus([x, y], r_in, r_out)\n\nA circular aperture.\n\nExamples\n\njulia> ap = CircularAnnulus(0, 0, 5, 10)\nCircularAnnulus(0, 0, r_in=5, r_out=10)\n\n\n\n\n\n\n","category":"type"},{"location":"apertures.html#Elliptical-Apertures-1","page":"Apertures","title":"Elliptical Apertures","text":"","category":"section"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by the semi-major axis a and semi-minor axis b.","category":"page"},{"location":"apertures.html#Rectangular-Apertures-1","page":"Apertures","title":"Rectangular Apertures","text":"","category":"section"},{"location":"apertures.html#","page":"Apertures","title":"Apertures","text":"These apertures are parametrized by side-length a and side-length b.","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"CurrentModule = Photometry\nDocTestSetup = :(using Photometry)","category":"page"},{"location":"index.html#Photometry-1","page":"Home","title":"Photometry","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"(Image: Build Status) (Image: Coverage)","category":"page"},{"location":"index.html#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"To install from the REPL, enter Pkg-mode (])","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"pkg> add https://github.com/mileslucas/Photometry.jl","category":"page"},{"location":"index.html#Getting-Started-1","page":"Home","title":"Getting Started","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"Here is a basic example to do some aperture photometry using CircularAperture and CircularAnnulus. The photometry function performs the photometry using a given method. ","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"data = ones(100, 100)\nerr = ones(100, 100)\n\nap1 = CircularAperture(50, 50, 3)\n# partial overlap\nap2 = CircularAperture(0.5, 0.5, 5)\n\nresults = photometry([ap1, ap2], data, err)\n@assert results.aperture_sum[1] ≈ 9π\n@assert results.aperture_sum[2] ≈ 25π / 4\n\nresults\n\n# output\n2×4 DataFrames.DataFrame\n│ Row │ xcenter │ ycenter │ aperture_sum │ aperture_sum_err │\n│     │ Any     │ Any     │ Any          │ Any              │\n├─────┼─────────┼─────────┼──────────────┼──────────────────┤\n│ 1   │ 50      │ 50      │ 28.2743      │ 5.31736          │\n│ 2   │ 0.5     │ 0.5     │ 19.635       │ 4.43113          │","category":"page"},{"location":"index.html#Contributing-1","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"If you're interested in contributing, go ahead and check out the issues or make a pull request. If you add a new feature, please write appropriate unit tests for it and bump the package's minor version.","category":"page"}]
}
