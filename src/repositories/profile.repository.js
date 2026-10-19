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
                model: this.User,
                as: 'user',
                attributes: ['id', 'email']
            },
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

        attributes: [
            'id',
            'user_id',
            'name',
            'title',
            'nickname',
            'birth_date',
            'description',
            'city_id',
            'whatsapp',
            'telegram'
        ],

        include: [
            {
                model: this.User,
                as: 'user',
                where: { status: 'ACTIVE' }, // 🚀 Valida que el usuario dueño del perfil esté activo
                attributes: [email]
            },

            {
        model: this.Photo,
        as: 'photos',
        attributes: [
            'id',
            'url',
            'is_main',
            'sort_order'
        ]
    },

           {
        model: this.Video,
        as: 'videos',
        attributes: [
            'id',
            'url',
            'thumbnail_url',
            'sort_order'
        ]
    },

           {
    model: this.City,
    as: 'cityData',
    attributes: [
        'id',
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

    cityInclude.required = true;

    cityInclude.include[0].where = {
        id: filters.departmentId
    };

    cityInclude.include[0].required = true;
}
   
    return await this.Profile.findAndCountAll({
        where,

        attributes: [
            'id',
            'name',
            'title',
            'nickname',
            'city_id',
            [
                this.Profile.sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM profile_views AS pv
                    WHERE pv.profile_id = Profile.id
                )`),
                'total_views'
            ]
        ],

        include: [
            {
                model: this.User,
                as: 'user', // Asegúrate de que la relación en models esté definida como 'user'
                where: { status: 'ACTIVE' }, // 🚀 Oculta si el usuario está inactivo o dado de baja
                attributes: ['email']
            },
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
            [
                this.Profile.sequelize.literal('total_views'),
                'DESC'
            ],
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
},
include: [
{
model: this.Photo,
as: 'photos',
attributes: [
'id',
'url',
'is_main',
'sort_order'
],
required: false
}
],
order: [
[
{ model: this.Photo, as: 'photos' },
'sort_order',
'ASC'
]
]
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
async findUserById(userId) {
        return await this.User.findByPk(userId, {
            attributes: { include: ['password_hash'] } // 🚀 Incluimos el hash de la BD
        });
    }

    async updatePassword(userId, newPasswordHash) {
        const user = await this.User.findByPk(userId);
        if (!user) {
            return null;
        }
        user.password_hash = newPasswordHash; // 🚀 Actualizamos el campo correcto
        await user.save();
        return user;
    }
}

module.exports = ProfileRepository;