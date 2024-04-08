import {describe} from 'mocha';
import {ProgramRunner} from '../src/ProgramRunner';
import {MockCommanderAndReferenceManager} from './MockCommanderAndReferenceManager';
import {deepStrictEqual} from 'assert';
import {Command} from '../src/Command';
import {references} from '../src/Program';


const programs = {
    noReferences: undefined,
    singleReferenceInCondition: undefined,
    twoReferences: undefined,
    twoReferencesWithWrite: undefined
};

const commandOpen = Object.assign(new Command({name: ''}), {
    _commandId: 56,
    _commandValue: 'open',
    _deviceId: 5451,
    _params: [],
    name: `5451.56.open`
});

const commandClose = Object.assign(new Command({name: ''}), {
    _commandId: 56,
    _commandValue: 'close',
    _deviceId: 5451,
    _params: [],
    name: `5451.56.close`
});

describe('Test ProgramRunner', () => {
    beforeEach(() => {
        references.length = 0;
        programs.noReferences = [
            {
                name: 'fork',
                block: [
                    {
                        name: 'if',
                        block: [
                            {
                                name: '5451.56.close',
                                params: []
                            }
                        ],
                        condition: 'hours(now) > 14 && hours(now) < 23'
                    },
                    {
                        name: 'else',
                        block: [
                            {
                                name: '5451.56.open',
                                params: []
                            }
                        ],
                        condition: ''
                    }
                ],
                condition: ''
            }
        ];

        programs.singleReferenceInCondition = [
            {
                name: 'fork',
                block: [
                    {
                        name: 'if',
                        block: [
                            {
                                name: 'if',
                                block: [
                                    {
                                        name: '5451.56.close',
                                        params: []
                                    }
                                ],
                                condition: '5451.Relay1 === \'open\''
                            }
                        ],
                        condition: 'hours(now) > 14 && hours(now) < 23'
                    },
                    {
                        name: 'else',
                        block: [
                            {
                                name: '5451.56.open',
                                params: []
                            }
                        ],
                        condition: ''
                    }
                ],
                condition: ''
            }
        ];

        programs.twoReferences = [
            {
                name: 'fork',
                block: [
                    {
                        name: 'if',
                        block: [
                            {
                                name: 'if',
                                block: [
                                    {
                                        name: '5451.56.close',
                                        params: []
                                    }
                                ],
                                condition: '5451.Relay1 === \'open\''
                            }
                        ],
                        condition: 'hours(now) > 14 && hours(now) < 23 && 5439.lvl_measurement_percent_full > 50'
                    },
                    {
                        name: 'else',
                        block: [
                            {
                                name: '5451.56.open',
                                params: []
                            }
                        ],
                        condition: ''
                    }
                ],
                condition: ''
            }
        ];

        programs.twoReferencesWithWrite = [
            {
                name: 'fork',
                block: [
                    {
                        name: 'if',
                        block: [
                            {
                                name: 'if',
                                block: [
                                    {
                                        name: '5451.56.close',
                                        params: []
                                    },
                                    {
                                        reference: '5451.number',
                                        value: 1
                                    }
                                ],
                                condition: '5451.Relay1 === \'open\''
                            }
                        ],
                        condition: 'hours(now) > 14 && hours(now) < 23 && 5439.lvl_measurement_percent_full > 50'
                    },
                    {
                        name: 'else',
                        block: [
                            {
                                name: '5451.56.open',
                                params: []
                            },
                            {
                                reference: '5451.number',
                                value: 0
                            }
                        ],
                        condition: ''
                    }
                ],
                condition: ''
            }
        ];
    });


    it('Tests represent', () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();
        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;

        programRunner.parseProgram(programs.noReferences);

        deepStrictEqual(programRunner.represent(), programs.noReferences);
    });

    it('Tests run no references', async () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();

        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;
        programRunner.parseProgram(programs.noReferences);

        await programRunner.run(false);

        deepStrictEqual(mockCommanderAndReferenceManager.dry, false);
        deepStrictEqual(mockCommanderAndReferenceManager.sendCommandsCalledWithCommands, [commandClose]);
        deepStrictEqual(mockCommanderAndReferenceManager.referencesLoaded, [
        ]);
    });

    it('Tests run single reference', async () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();

        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;
        programRunner.parseProgram(programs.singleReferenceInCondition);

        await programRunner.run(false);

        deepStrictEqual(mockCommanderAndReferenceManager.dry, false);
        deepStrictEqual(mockCommanderAndReferenceManager.sendCommandsCalledWithCommands, [commandClose]);
        deepStrictEqual(mockCommanderAndReferenceManager.referencesLoaded, [
            '5451.Relay1'
        ]);
    });

    it('Tests run two references', async () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();

        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;
        programRunner.parseProgram(programs.twoReferences);

        await programRunner.run(false);

        deepStrictEqual(mockCommanderAndReferenceManager.dry, false);
        deepStrictEqual(mockCommanderAndReferenceManager.sendCommandsCalledWithCommands, [commandOpen]);
        deepStrictEqual(mockCommanderAndReferenceManager.referencesLoaded, [
            '5439.lvl_measurement_percent_full',
            '5451.Relay1',
        ]);
    });

    it('Tests run two references with write', async () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();

        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;
        programRunner.parseProgram(programs.twoReferencesWithWrite);

        await programRunner.run(false);

        deepStrictEqual(mockCommanderAndReferenceManager.dry, false);
        deepStrictEqual(mockCommanderAndReferenceManager.sendCommandsCalledWithCommands, [commandOpen]);
        deepStrictEqual(mockCommanderAndReferenceManager.referencesLoaded, [
            '5439.lvl_measurement_percent_full',
            '5451.Relay1',
            '5451.number',
        ]);
    });

    it('Tests run dry two references with write', async () => {
        const programRunner = new ProgramRunner();
        const mockCommanderAndReferenceManager = new MockCommanderAndReferenceManager();

        programRunner.commander = mockCommanderAndReferenceManager;
        programRunner.referenceManager = mockCommanderAndReferenceManager;
        programRunner.parseProgram(programs.twoReferencesWithWrite);

        await programRunner.run(true);

        deepStrictEqual(mockCommanderAndReferenceManager.dry, true);
        deepStrictEqual(mockCommanderAndReferenceManager.sendCommandsCalledWithCommands, [commandOpen]);
        deepStrictEqual(mockCommanderAndReferenceManager.referencesLoaded, [
            '5439.lvl_measurement_percent_full',
            '5451.Relay1',
            '5451.number',
        ]);
    });
});
