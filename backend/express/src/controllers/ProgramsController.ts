import {Route, Controller, Get, Post, Path, Body, Tags} from 'tsoa';
import {Program, Version} from '../model/Program';
import {Inject, Service} from "typedi";
import {DataSource, Repository} from 'typeorm';
import {Group} from "../model/Group";
import {Container} from "typedi";
import {ReferenceManagerAndCommander} from "../services/ReferenceManagerAndCommander";
import {ProgramRunner as PrototypeProgramRunner} from "../../../ProgrammingLogimicPrototype";
import {DeviceService} from "../services/DeviceService";

@Service()
@Route('programs')
@Tags("program")
export class ProgramController extends Controller {
    private deviceService: DeviceService;
    private dataSource: DataSource;
    private groupRepository: Repository<Group>;
    private programRepository: Repository<Program>;
    private referenceManagerAndCommander: ReferenceManagerAndCommander;

    constructor() {
        super();
        this.dataSource = Container.get(DataSource);
        this.groupRepository = this.dataSource.getRepository(Group);
        this.programRepository = this.dataSource.getRepository(Program);
        this.deviceService = Container.get(DeviceService);
        this.referenceManagerAndCommander = new ReferenceManagerAndCommander(this.deviceService);
    }

    @Get('{id}')
    public async getProgram(@Path() id: number): Promise<Program | null> {
        return this.programRepository.findOne({ where: { id }, order: { id: 'ASC' } });
    }

    @Get('ofGroup/{id}')
    public async getProgramOfGroup(@Path() id: number): Promise<Program[]> {
        return await this.programRepository.find({ where: { group: { id } }, order: { id: 'ASC' } });
    }

    @Post()
    public async createProgram(@Body() body: { data: any, groupId: number }): Promise<Program> {
        const group = await this.groupRepository.findOneBy({id: body.groupId});
        if (!group) {
            this.setStatus(404);
            return Promise.reject("Group not found");
        }

        const program = new Program();
        program.data = body.data;
        program.group = group;

        return this.programRepository.save(program);
    }

    @Post('prototype/run')
    public async prototypeRunProgram(@Body() program: any[]): Promise<any> {
        const runner = new PrototypeProgramRunner()
            .setCommander(this.referenceManagerAndCommander)
            .setReferenceManager(this.referenceManagerAndCommander)
            .parseProgram(program);
        const {commands} = await runner.run();
        return commands;
    }

    @Post('v1/run')
    public async v1RunProgram(@Body() program: object): Promise<any> {
        try {
            const runner = new PrototypeProgramRunner()
                .setCommander(this.referenceManagerAndCommander)
                .setReferenceManager(this.referenceManagerAndCommander)
                .parseProgram(program);
            const {commands} = await runner.run();
            return commands.map(command => ({
                name: `${command.deviceId}.${command.commandId}`,
                params: command.params
            }));
        } catch (e) {
            console.log(e);
            throw e;
        }

    }

    @Get('meta/{version}')
    public async getMetaLanguage(@Path() version: Version): Promise<any> {
        return {
            "variables": {

            },
            "statements": {
                "_": {
                    "name": "_",
                    "component": "compound",
                    "label": "_",
                    "icon": "pi-code",
                    "color": "black",
                    "levels": [
                        -1
                    ],
                    "backgroundColor": "#FFFFFF"
                },
                "fork": {
                    "name": "fork",
                    "component": "compound",
                    "label": "fork",
                    "icon": "pi-sitemap",
                    "color": "white",
                    "backgroundColor": "#9F8C3E",
                    "avoidParents": [
                        "fork",
                        "switch"
                    ],
                    "extensions": {
                        "enableCondition": false
                    }
                },
                "if": {
                    "name": "if",
                    "component": "compound",
                    "label": "if",
                    "icon": "pi-question-circle",
                    "color": "white",
                    "backgroundColor": "#BFB27C",
                    "avoidParents": [
                        "switch"
                    ],
                    "extensions": {
                        "enableCondition": true
                    }
                },
                "else": {
                    "name": "else",
                    "component": "compound",
                    "label": "else",
                    "icon": "pi-question-circle",
                    "color": "white",
                    "backgroundColor": "#BFB27C",
                    "parents": [
                        "fork"
                    ],
                    "avoidParents": [
                        "switch"
                    ],
                    "positions": [
                        "last"
                    ],
                    "avoidPositions": [
                        "first"
                    ],
                    "extensions": {
                        "enableCondition": false
                    }
                }
            },
            "err": {
                "icon": "pi-exclamation-triangle",
                "color": "red",
                "backgroundColor": "#F9F63D"
            }
        }
    }
}
