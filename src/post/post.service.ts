import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  create(createPostDto: CreatePostDto, creatorUser: string) {
    const createdPost = new this.postModel({ ...createPostDto, creatorUser });
    return createdPost.save();
  }

  findAll() {
    return this.postModel
      .find()
      .populate<{
        creatorUser: User;
      }>({
        path: 'creatorUser',
        select: '-password -roles',
      })
      .exec();
  }

  findOne(id: string) {
    return this.postModel
      .findById(id)
      .populate<{
        creatorUser: User;
      }>({
        path: 'creatorUser',
        select: '-password -roles',
      })
      .exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
