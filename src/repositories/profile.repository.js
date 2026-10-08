const { Op } = require('sequelize');
class ProfileRepository {

    constructor(models) {
        this.Profile = models.Profile;
        this.ProfileView = models.ProfileView;
        this.User = models.User;
        this.Photo = models.Photo;
        this.Video = models.Video;
        this.City = models.City;
        this.Department = models.Department;
    }

    async findById(id) {
        return await this.Profile.findByPk(id, {
            include: [
                {
                    model: this.Photo,
                    as: 'photos'
                },
                {
                    model: this.Video,
                    as: 'videos'
                }
            ]
        });
    }

    async findPublicById(id) {

    return await this.Profile.findOne({

        where: {
            id,
            status: 'ACTIVE'
        },

        include: [

            {
                model: this.Photo,
                as: 'photos'
            },

            {
                model: this.Video,
                as: 'videos'
            },

            {
                model: this.City,
                as: 'cityData',
                include: [
                    {
                        model: this.Department,
                        as: 'department'
                    }
                ]
            }
        ]
    });
}

async findAllActive(limit, offset, filters = {}) {

    const where = {
        status: 'ACTIVE'
    };

    if (filters.name) {
        where.name = {
            [Op.like]: `%${filters.name}%`
        };
    }

    if (filters.title) {
        where.title = {
            [Op.like]: `%${filters.title}%`
        };
    }

    if (filters.cityId) {
        where.city_id = filters.cityId;
    }

    const cityInclude = {
        model: this.City,
        as: 'cityData',
        attributes: [
            'id',
            'department_id',
            'code',
            'name'
        ],
        include: [
            {
                model: this.Department,
                as: 'department',
                attributes: [
                    'id',
                    'code',
                    'name'
                ]
            }
        ],
        required: false
    };

    if (filters.departmentId) {
        cityInclude.where = {
            department_id: filters.departmentId
        };

        cityInclude.required = true;
    }

    return await this.Profile.findAndCountAll({

        where,

        attributes: [
            'id',
            'name',
            'title',
            'nickname',
            'city_id'
        ],

        include: [
            {
                model: this.Photo,
                as: 'photos',
                attributes: [
                    'id',
                    'url',
                    'is_main'
                ],
                where: {
                    is_main: true
                },
                required: false
            },

            cityInclude
        ],

        order: [
            ['id', 'DESC']
        ],

        limit,
        offset,
        distinct: true
    });
}

    async findByUserId(userId) {
        return await this.Profile.findOne({
            where: {
                user_id: userId
            }
        });
    }

async create(data, transaction) {
    return await this.Profile.create(data, {
        transaction
    });
}

    async update(id, data) {
        const profile = await this.Profile.findByPk(id);

        if (!profile) {
            return null;
        }

        await profile.update(data);

        return profile;
    }

    async delete(id) {
        const profile = await this.Profile.findByPk(id);

        if (!profile) {
            return null;
        }

        await profile.destroy();

        return profile;
    }
  


async createView(profileId, visitorToken) {
    return await this.ProfileView.create({
        profile_id: profileId,
        visitor_token: visitorToken
    });
}

async hasViewed(profileId, visitorToken) {
    if (!visitorToken) {
        return false;
    }

    const view = await this.ProfileView.findOne({
        where: {
            profile_id: profileId,
            visitor_token: visitorToken
        }
    });

    return !!view;
}

async countViews(profileId) {
    return await this.ProfileView.count({
        where: {
            profile_id: profileId
        }
    });
}
}

module.exports = ProfileRepository;