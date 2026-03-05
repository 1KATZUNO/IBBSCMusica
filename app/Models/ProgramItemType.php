<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ProgramItemType extends Model
{
    protected $fillable = ['organization_id', 'slug', 'label', 'emoji', 'bg_color', 'is_system', 'requires_canto'];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
            'requires_canto' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        // Custom scope: system types (org_id=NULL) visible to all, plus org-specific
        static::addGlobalScope('organization', function (Builder $builder) {
            $user = auth()->user();

            if ($user && $user->organization_id) {
                $builder->where(function ($q) use ($user) {
                    $q->whereNull('organization_id')
                      ->orWhere('organization_id', $user->organization_id);
                });
            }
        });

        static::creating(function ($model) {
            if (!$model->organization_id && !$model->is_system && auth()->check() && auth()->user()->organization_id) {
                $model->organization_id = auth()->user()->organization_id;
            }
        });
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
