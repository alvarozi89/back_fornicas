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