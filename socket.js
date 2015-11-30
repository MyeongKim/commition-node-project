/**
 * Created by nuko on 2015. 7. 14..
 */
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');

var User = require('./models/user');
var Commition = require('./models/commition');
var Request = require('./models/request');


moment.locale('ko');
function timeFromNow(time){
    return moment(time).utcOffset(540).fromNow();
}


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
        User.update({_id : userId}, { $addToSet : {"hearted" : csId}}).exec(function(err, data){
            if (err) throw err;
        });
    },
    cancelHeartPlus : function (csId, userId) {
        Commition.update({_id : csId}, { $pull: {"fans": userId}}, function(err,data){
            if (err) return next(err);
            console.log("pull success");
        });
        User.update({_id : userId}, { $pull : {"hearted" : csId}}).exec(function(err, data){
            if (err) throw err;
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
    getRequestData : function(nickname, type, pageNum, mycallback){
        if( type === "requestSendButton"){
            var requestSendArray = [];
            User.findOne({nickname : nickname}).exec(function(err, user){
                if (err) throw err;
                user = user;
                if(user.requestSend.length !== 0){
                    Request.find({ '_id' : { $in : user.requestSend}})
                            .populate('from to ref_commition')
                            .sort('-time')
                            .skip((pageNum-1)*5)
                            .limit(5)
                            .exec(function(err, requestSend){
                                if(err) throw err;
                                requestSendArray = requestSend;
                                requestSendArray.push([]);
                                var dataLength = requestSendArray.length-1
                                for(var i = 0 ; i < dataLength ; i++){
                                    requestSendArray[dataLength][i] = (moment(requestSendArray[i].time).utcOffset(540).fromNow());
                                }
                                mycallback(requestSendArray);
                            });
                }else {
                    return;
                }
            });
        }else if( type === "requestReceiveButton"){
            var requestReceiveArray = [];
            User.findOne({nickname : nickname}).exec(function(err, user){
                if (err) throw err;
                user = user;
                if(user.requestReceive.length !== 0){
                    Request.find({ '_id' : { $in : user.requestReceive}})
                            .populate('from to ref_commition')
                            .sort('-time')
                            .skip((pageNum-1)*5)
                            .limit(5)
                            .exec(function(err, requestReceive){
                                if(err) throw err;
                                requestReceiveArray = requestReceive;
                                requestReceiveArray.push([]);
                                var dataLength = requestReceiveArray.length-1
                                for(var i = 0 ; i < dataLength ; i++){
                                    requestReceiveArray[dataLength][i] = (moment(requestReceiveArray[i].time).utcOffset(540).fromNow());
                                }
                                mycallback(requestReceiveArray);
                            });
                }else {
                    return;
                }
            });
        }else {
            async.waterfall([
                function(callback) {
                    User.findOne({nickname : nickname}).exec(function(err, user){
                        if (err) throw err;
                        callback(null, user);
                    });
                },
                function(user, callback) {
                    var requestSendArray = [];
                    if(user.requestSend.length !== 0){
                        Request.find({ '_id' : { $in : user.requestSend}})
                            .populate('from to ref_commition')
                                .sort('-time')
                                .limit(pageNum * 5)
                                .exec(function(err, requestSend){
                                    if(err) throw err;
                                    // console.log(requestSend);
                                    requestSendArray = requestSend;
                                    callback(null, user, requestSendArray);
                                });
                    } else {
                        callback(null, user, requestSendArray);
                    }
                },
                function(user, requestSendArray, callback) {
                    var requestReceiveArray = [];

                    if(user.requestReceive.length !== 0){
                        Request.find({ '_id' : { $in : user.requestReceive}})
                            .populate('from to ref_commition')
                            .sort('-time')
                            .limit(pageNum * 5)
                            .exec(function(err, requestReceive){
                                if(err) throw err;
                                requestReceiveArray = requestReceive;
                                callback(null, user, requestSendArray, requestReceiveArray);
                            });
                    }else {
                        callback(null, user, requestSendArray, requestReceiveArray);
                    }
                },
                function(user, requestSendArray, requestReceiveArray, callback){
                    var requestAllArray = requestReceiveArray.concat(requestSendArray);
                    requestAllArray = requestAllArray.sort(function(a,b){return b.time - a.time}).slice((pageNum-1)*5, (pageNum-1)*5+5);
                    requestAllArray.push([]);
                    var dataLength = requestAllArray.length-1
                    for(var i = 0 ; i < dataLength ; i++){
                        requestAllArray[dataLength][i] = (moment(requestAllArray[i].time).utcOffset(540).fromNow());
                    }
                    mycallback(requestAllArray);
                    callback(null);
                }
            ], function (err) {
                if (err) throw err;
                }
            )
        }
    },
    getCommitionData : function(nickname, type, pageNum, mycallback){
        if( type === "commitionMineButton"){
            var commitionMineArray = [];
            User.findOne({nickname : nickname}).exec(function(err, user){
                if (err) throw err;
                Commition.find({ user : user._id })
                        .populate('user')
                        .sort('-time')
                        .skip((pageNum-1)*5)
                        .limit(5)
                        .exec(function(err, commitionMine){
                            if (err) throw err;
                            commitionMineArray = commitionMine;
                            mycallback(commitionMineArray);
                        });
            });
        }else if( type === "commitionHeartedButton"){
            var commitionHeartedArray = [];
            User.findOne({nickname : nickname}).exec(function(err, user){
                if (err) throw err;
                Commition.find({ fans : user._id })
                        .populate('user')
                        .sort('-time')
                        .skip((pageNum-1)*5)
                        .limit(5)
                        .exec(function(err, commitionHearted){
                            if (err) throw err;
                            commitionHeartedArray = commitionHearted;
                            mycallback(commitionHeartedArray);
                        });
            });
        }else {
            async.waterfall([
                function(callback) {
                    User.findOne({nickname : nickname}).exec(function(err, user){
                        if (err) throw err;
                        callback(null, user);
                    });
                },
                function(user, callback) {
                    var commitionMineArray = [];
                    Commition.find({ user : user._id })
                            .populate('user')
                            .sort('-time')
                            .skip((pageNum-1)*5)
                            .limit(5)
                            .exec(function(err, commitionMine){
                                if (err) throw err;
                                commitionMineArray = commitionMine;
                                callback(null, user, commitionMineArray);
                            });
                },
                function(user, commitionMineArray, callback) {
                    var commitionHeartedArray = [];
                    Commition.find({ fans : user._id })
                        .populate('user')
                        .sort('-time')
                        .skip((pageNum-1)*5)
                        .limit(5)
                        .exec(function(err, commitionHearted){
                            if (err) throw err;
                            commitionHeartedArray = commitionHearted;
                            callback(null, user, commitionMineArray, commitionHeartedArray);
                        });
                },
                function(user, commitionMineArray, commitionHeartedArray, callback){
                    var commitionAllArray = [];
                    commitionAllArray = commitionMineArray.concat(commitionHeartedArray);

                    for( var i = 0 ; i < commitionAllArray.length ; i++){
                        for(var j = i+1 ; j < commitionAllArray.length ; j++){
                            if(commitionAllArray[i]._id.toString() == commitionAllArray[j]._id.toString()){
                                commitionAllArray.splice(j,1);
                            }
                        }
                    }
                    commitionAllArray = commitionAllArray.sort(function(a,b){return b.time - a.time}).slice((pageNum-1)*5, (pageNum-1)*5+5);
                    mycallback(commitionAllArray);
                    callback(null);
                }
            ], function (err) {
                if (err) throw err;
                }
            )

    }
}

};