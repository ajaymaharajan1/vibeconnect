'use client';

import React, { useState } from 'react';
import { SocialPost } from '../types';
import { Heart, MapPin, MessageCircle, Share2 } from 'lucide-react';

interface SocialFeedCardProps {
  post: SocialPost;
}

export function SocialFeedCard({ post }: SocialFeedCardProps) {
  const [likes, setLikes] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 mb-5 max-w-2xl mx-auto">
      {/* Author Bar */}
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={post.author.photoUrl}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
        />
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-slate-900">{post.author.name}</h4>
            {post.communityName && (
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                in {post.communityName}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 flex items-center space-x-1">
            <span>{post.author.city}</span>
            {post.locationName && (
              <>
                <span>•</span>
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="font-semibold text-slate-700">{post.locationName}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Post Text Content */}
      <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* Photo Attachment */}
      {post.photoUrl && (
        <div className="rounded-xl overflow-hidden mb-4 max-h-96 w-full bg-slate-100 border border-slate-100">
          <img
            src={post.photoUrl}
            alt="Post Memory"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Like & Comment Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600 font-semibold">
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
            hasLiked ? 'bg-rose-50 text-rose-600' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{likes} Likes</span>
        </button>

        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
