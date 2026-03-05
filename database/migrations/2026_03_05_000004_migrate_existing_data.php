<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Create default organization
        $orgId = DB::table('organizations')->insertGetId([
            'name' => 'IBBSC',
            'slug' => 'ibbsc',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Assign all existing records to the default org
        $tables = ['users', 'cultos', 'cantos', 'musicians', 'musician_roles', 'directors', 'settings', 'program_item_types'];

        foreach ($tables as $table) {
            DB::table($table)->whereNull('organization_id')->update(['organization_id' => $orgId]);
        }

        // Rename role 'viewer' → 'member'
        DB::table('users')->where('role', 'viewer')->update(['role' => 'member']);
    }

    public function down(): void
    {
        // Revert role rename
        DB::table('users')->where('role', 'member')->update(['role' => 'viewer']);

        // Remove default org assignment
        $tables = ['users', 'cultos', 'cantos', 'musicians', 'musician_roles', 'directors', 'settings', 'program_item_types'];
        foreach ($tables as $table) {
            DB::table($table)->update(['organization_id' => null]);
        }

        // Delete default org
        DB::table('organizations')->where('slug', 'ibbsc')->delete();
    }
};
