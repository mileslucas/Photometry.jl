using Photometry.Aperture: edges,
                           bbox
                           # oblique_coefficients
using Photometry.Aperture: oblique_coefficients

@testset "Apertures" begin

    ap_elipse = EllipticalAperture(0, 0, 20, 10, 0)
    @test bbox(ap_elipse) == (-20, 20, -10, 10)

    ap_elipse = EllipticalAperture(0,0,2,1,45)
    xmin, xmax, ymin, ymax = bbox(ap_elipse)

    @test xmin == -2
    @test xmax == 2
    @test ymax == 2
    @test ymin == -2

end

@testset "Elliptical Aperture" begin

    e0 = EllipticalAperture(0, 0, 20, 10 , 0)
    @test sprint(show, e0) == "EllipticalAperture(0, 0, a=20, b=10, theta=0°)"

end

@testset "oblique_coefficients" begin
    @test all(oblique_coefficients(2, 2, 0)) .≈ (0.25, 0.25, 0.0) atol 1e-4
    @test all(oblisque_coefficients(2, 2, 90)) .≈ (0.25, 0.25, 0.0) atol 1e-4
    @test all(oblique_coefficients(2, 1, 30)) .≈ (7/16, 13/16, -6*sqrt(3)/16) atol 1e-4
end
