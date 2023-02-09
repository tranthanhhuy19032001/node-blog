const Course = require('../models/Course');
const { mutilpleMongooseToObject } = require('../../util/mongoose');
class MeController {
    // [GET] /me/store/courses
    storedCourses(req, res, next) {
        let courseQuery = Course.find({});

        if (req.query.hasOwnProperty('_sort')) {
            courseQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([courseQuery, Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: mutilpleMongooseToObject(courses),
                });
            })
            .catch(next);
    }

    //// [GET] /me/trash/courses
    trashCourses(req, res, next) {
        let courseDeletedQuery = Course.findDeleted({});

        if (req.query.hasOwnProperty('_sort')) {
            courseDeletedQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        courseDeletedQuery
            .then((courses) => {
                res.render('me/trash-courses', {
                    courses: mutilpleMongooseToObject(courses),
                });
            })
            .catch(next);
    }
}

module.exports = new MeController();
