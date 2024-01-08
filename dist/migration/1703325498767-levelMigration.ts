// Run migrations when starting with empty database

// import { MigrationInterface, QueryRunner } from "typeorm"
// import Level from "../../modules/Level/Level.entity";

// export class levelMigration1703325498767 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         const numberOfLevels = 25;
//         let requiredTotalScore = 0;
//         let maxTotalScore = 99;
//         let maxScore = 99;

//         for (let i = 1; i <= numberOfLevels; i++) {
//             await queryRunner.manager.save(
//                 queryRunner.manager.create<Level>(Level, {
//                     levelNumber: i,
//                     requiredTotalScore,
//                     maxTotalScore,
//                     maxScore,
//                 }),
//             );

//             maxScore = maxTotalScore + 1;
//             maxTotalScore =  Math.round(maxScore + maxScore / 3 * 2) - 1;
//             requiredTotalScore = maxTotalScore - maxScore;
//         }
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//     }

// }