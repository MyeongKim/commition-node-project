/**
 * Created by nuko on 2015. 7. 14..
 */
var mongoose = require('mongoose');

var User = require('./models/user');
var Commition = require('./models/commition');

// var CommitModel = require('./models/model.js').CommitModel;
// var UserModel = require('./models/model.js').UserModel;

module.exports = {
    heartPlus : function(csId , userId){
        Commition.findOne({_id : csId}).exec(function (err,data) {
                Commition.update({_id : csId}, { $addToSet: {"fans": userId}}).exec(function (err, data) {
                    if (err) return next(err);
                    console.log("push success");
                    console.log(data);
                });
        });
    },
    cancelHeartPlus : function (csId, userId) {
        Commition.update({_id : csId}, { $pull: {"fans": userId}}, function(err,data){
            if (err) return next(err);
            console.log("pull success");
        });
    },
    viewPlus : function(csId){
        Commition.update({_id : csId},  { $inc: { view: 1 }}, function(err,data){
            if (err) return next(err);
        });
    },

    // csAlarmPlus : function (csId, userId){
    //     UserModel.update({_id : userId},  { $addToSet: {"csAlarm": csId}}, function(err,data){
    //         if (err) return next(err);
    //     });
    // },
    // cancelCsAlarmPlus : function (csId, userId){
    //     UserModel.update({_id : userId},  { $pull: {"csAlarm": csId}}, function(err,data){
    //         if (err) return next(err);
    //     });
    // },
    followPlus : function (creatorId, userId){
        User.update({_id : creatorId},  { $addToSet: {"follower": userId}}, function(err,data){
            if (err) return next(err);
            User.update({_id : userId},  { $addToSet: {"following": creatorId}}, function(err,data){
                if (err) return next(err);
            });
        });

    },
    followMinus : function (creatorId, userId){
        User.update({_id : creatorId},  { $pull: {"follower": userId}}, function(err,data){
            if (err) return next(err);
            User.update({_id : userId},  { $pull: {"following": creatorId}}, function(err,data){
                if (err) return next(err);
            });
        });
    },
    // newComment : function (csId, userId, comment){
    //     CommitModel.update({_id : csId},  { $push: {"comments": {"comment" : comment , postedBy : userId}}}, function(err,data){
    //         if (err) return next(err);
    //         console.log(data);
    //     });
    // },
    // getCommentsId : function(csId){
    //     CommitModel.find({_id : csId}).populate('comments.postedBy').exec(function (err, comments) {
    //         if (err) return next(err);
    //         console.log(comments);
    //     });
    // },
    // newReply : function(csId, commentId, reply){
    //     CommitModel.update({_id : csId, 'comments._id' : commentId},  { $set: {'comments.$.finished' : true, 'comments.$.reply' : reply}}, function(err,data){
    //         if (err) return console.log(err);

    //         console.log(data);
    //     });
    // }
};