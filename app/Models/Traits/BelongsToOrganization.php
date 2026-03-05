<?php

namespace App\Models\Traits;

use App\Models\Organization;
use App\Models\Scopes\OrganizationScope;

trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope(new OrganizationScope);

        static::creating(function ($model) {
            if (!$model->organization_id && auth()->check() && auth()->user()->organization_id) {
                $model->organization_id = auth()->user()->organization_id;
            }
        });
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
