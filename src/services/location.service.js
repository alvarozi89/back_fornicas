const LocationRepository = require('../repositories/location.repository');

class LocationService {

    constructor() {
        this.locationRepository = new LocationRepository();
    }

    async getDepartments() {

        return await this.locationRepository.findAllDepartments();
    }

    async getCitiesByDepartmentId(departmentId) {

        departmentId = Number(departmentId);

        if (
            !Number.isInteger(departmentId) ||
            departmentId < 1
        ) {
            throw new Error('El departamento no es válido');
        }

        return await this.locationRepository.findCitiesByDepartmentId(
            departmentId
        );
    }
}

module.exports = LocationService;