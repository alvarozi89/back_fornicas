const db = require('../models');

class LocationRepository {

    constructor() {
        this.Department = db.Department;
        this.City = db.City;
    }

    async findAllDepartments() {

        return await this.Department.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
    }

        
    async findAllCities() {
        return await this.City.findAll({
            attributes: ['id', 'code', 'name', 'department_id'],
            order: [
                ['name', 'ASC']
            ]
        });
}

    async findCitiesByDepartmentId(departmentId) {

        return await this.City.findAll({
            where: {
                department_id: departmentId
            },
            order: [
                ['name', 'ASC']
            ]
        });
    }
}

module.exports = LocationRepository;