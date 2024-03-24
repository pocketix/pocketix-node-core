import {Route, Controller, Get, Post, Put, Delete, Path, Body, Query, Tags} from 'tsoa';
import { Group } from '../model/Group';
import {DataSource, Repository, SelectQueryBuilder} from 'typeorm';
import {Container, Service} from "typedi";

@Service()
@Route('groups')
@Tags("group")
export class GroupController extends Controller {
    private dataSource: DataSource;
    private groupRepository: Repository<Group>;

    constructor() {
        super();
        this.dataSource = Container.get(DataSource);
        this.groupRepository = this.dataSource.getRepository(Group);
    }

    @Get('{id}')
    public async getGroup(@Path() id: number, @Query() includeDevices?: boolean): Promise<Group | null> {
        return this.groupRepository.findOne({where: {id}, relations: {devices: {parameterValues: true, capabilities: true}}});
    }

    @Get()
    public async getAllGroups(@Query() includeDevices?: boolean): Promise<Group[]> {
        let query: SelectQueryBuilder<Group> = this.groupRepository.createQueryBuilder('group');

        // Check if devices should be included
        if (!includeDevices) {
            query = query.leftJoinAndSelect('group.devices', 'device');
        }

        return query.getMany();
    }

    @Post()
    public async createGroup(@Body() body: Group): Promise<Group> {
        return this.groupRepository.save(body);
    }

    @Put('{id}')
    public async updateGroup(@Path() id: number, @Body() body: Group): Promise<Group | null> {
        const existingGroup = await this.groupRepository.findOne({where: {id}});
        if (!existingGroup) {
            return null;
        }

        const updatedGroup = { ...existingGroup, ...body };
        return this.groupRepository.save(updatedGroup);
    }

    @Delete('{id}')
    public async deleteGroup(@Path() id: number): Promise<void> {
        await this.groupRepository.delete(id);
        return;
    }
}
