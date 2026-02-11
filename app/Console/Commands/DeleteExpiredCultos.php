<?php

namespace App\Console\Commands;

use App\Models\Culto;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteExpiredCultos extends Command
{
    protected $signature = 'cultos:delete-expired';
    protected $description = 'Delete cultos that have passed by more than 4 hours';

    public function handle(): void
    {
        $now = Carbon::now();
        $deleted = 0;

        Culto::all()->each(function ($culto) use ($now, &$deleted) {
            $cultoDateTime = $this->parseCultoDateTime($culto);

            if ($cultoDateTime && $now->diffInHours($cultoDateTime, false) <= -4) {
                $culto->delete();
                $deleted++;
            }
        });

        $this->info("Deleted {$deleted} expired culto(s).");
    }

    private function parseCultoDateTime(Culto $culto): ?Carbon
    {
        try {
            $hora = $culto->hora;
            // Parse formats like "9:00 AM", "7:00 PM", "7:30 PM"
            $hora = str_replace('.', ':', $hora);
            $time = Carbon::parse($hora);

            return $culto->fecha->copy()
                ->setHour($time->hour)
                ->setMinute($time->minute)
                ->setSecond(0);
        } catch (\Exception $e) {
            return null;
        }
    }
}
