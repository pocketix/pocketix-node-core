import {deepStrictEqual, throws} from 'assert';
import {If, IfBranch} from '../src/If';
import {Command} from '../src/Command';


describe('Test IF, IfBranch', () => {
    describe('Test IfBranch', () => {
        it('Tests IfBranch if represent', () => {
            const rawIf = {
                name: 'if',
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '5451.Relay1 === \'open\''
            };
            const block = new IfBranch(rawIf);

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests IfBranch elseif represent', () => {
            const rawIf = {
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '5451.Relay1 === \'open\'',
                name: undefined
            };
            const block = new IfBranch(rawIf);

            rawIf.name = 'elseif';

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests IfBranch else represent', () => {
            const rawIf = {
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '',
                name: undefined
            };
            const block = new IfBranch(rawIf);

            rawIf.name = 'else';

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests IfBranch else evaluate', () => {
            const rawIf = {
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '',
                name: undefined
            };
            const block = new IfBranch(rawIf);
            const command = new Command(rawIf.block[0]);

            deepStrictEqual(block.evaluate(), [command]);
        });

        it('Tests IfBranch evaluate true', () => {
            const rawIf = {
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '1 > 0',
                name: undefined
            };
            const block = new IfBranch(rawIf);
            const command = new Command(rawIf.block[0]);

            deepStrictEqual(block.evaluate(), [command]);
        });

        it('Tests IfBranch evaluate false', () => {
            const rawIf = {
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '1 > 2',
                name: undefined
            };
            const block = new IfBranch(rawIf);

            deepStrictEqual(block.evaluate(), undefined);
        });
    });

    describe('Test If', () => {
        it('Tests If represent only If', () => {
            const rawIf = [{
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '5451.Relay1 === \'open\'',
                name: 'if'
            }];
            const block = new If(rawIf);

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests If represent only If, Else', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: 'if'
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '',
                    name: 'else'
                }
            ];
            const block = new If(rawIf);

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests If represent only If, ElseIf', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: 'if'
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: 'elseif'
                }
            ];
            const block = new If(rawIf);

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests If represent If, ElseIf, Else', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: 'if'
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: 'elseif'
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '',
                    name: 'else'
                }
            ];
            const block = new If(rawIf);

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests If represent If, ElseIf, Else without names', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\'',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '',
                    name: undefined
                }
            ];
            const block = new If(rawIf);

            rawIf[0].name = 'if';
            rawIf[1].name = 'elseif';
            rawIf[2].name = 'else';

            deepStrictEqual(block.represent(), rawIf);
        });

        it('Tests empty If', () => {
            const rawIf = [];

            throws(() => new If(rawIf), Error);
        });

        it('Tests If evaluate If', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 1',
                    name: undefined
                },
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[0].block[0])]);
        });

        it('Tests If evaluate If being false', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 3',
                    name: undefined
                },
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), undefined);
        });

        it('Tests If evaluate If Else, If true', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 1',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.open',
                            params: []
                        }
                    ],
                    condition: '1 === 3',
                    name: undefined
                },
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[0].block[0])]);
        });

        it('Tests If evaluate If Else, Else true', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 3',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.open',
                            params: []
                        }
                    ],
                    condition: '1 === 1',
                    name: undefined
                },
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[1].block[0])]);
        });

        it('Tests If evaluate If Else ElseIf, If true', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 1',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.open',
                            params: []
                        }
                    ],
                    condition: '1 === 3',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '100.56.open',
                            params: []
                        }
                    ],
                    name: undefined
                }
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[0].block[0])]);
        });

        it('Tests If evaluate If Else ElseIf, ElseIf true', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 0',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.open',
                            params: []
                        }
                    ],
                    condition: '1 === 1',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '100.56.open',
                            params: []
                        }
                    ],
                    name: undefined
                }
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[1].block[0])]);
        });

        it('Tests If evaluate If Else ElseIf, Else true', () => {
            const rawIf = [
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '1 === 0',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '5451.56.open',
                            params: []
                        }
                    ],
                    condition: '1 === 0',
                    name: undefined
                },
                {
                    block: [
                        {
                            name: '100.56.open',
                            params: []
                        }
                    ],
                    name: undefined
                }
            ];

            const block = new If(rawIf);

            deepStrictEqual(block.evaluate(), [new Command(rawIf[2].block[0])]);
        });

    });
});
