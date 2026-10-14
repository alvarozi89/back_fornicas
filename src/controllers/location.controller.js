const LocationService = require('../services/location.service');

class LocationController {

    constructor() {
        this.locationService = new LocationService();
    }

    getDepartments = async (req, res) => {

        try {

            const departments =
                await this.locationService.getDepartments();

            return res.status(200).json({
                success: true,
                data: departments
            });

        } catch (error) {

            console.error(
                'Error al obtener departamentos:',
                error
            );

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    getCitiesByDepartmentId = async (req, res) => {

        try {

            const { departmentId } = req.params;

            const cities =
                await this.locationService
                    .getCitiesByDepartmentId(departmentId);

            return res.status(200).json({
                success: true,
                data: cities
            });

        } catch (error) {

            console.error(
                'Error al obtener ciudades:',
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };
    
getAllCities = async (req, res) => {
    try {
        const cities = await this.locationService.getAllCities();

        return res.status(200).json({
            success: true,
            data: cities
        });
    } catch (error) {
        console.error('Error al obtener todas las ciudades:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
}

module.exports = LocationController;