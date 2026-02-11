<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MusicianRoleSeeder::class,
            MusicianSeeder::class,
            ProgramItemTypeSeeder::class,
            CantoSeeder::class,
            SettingSeeder::class,
            DirectorSeeder::class,
            CultoSeeder::class,
        ]);
    }
}
