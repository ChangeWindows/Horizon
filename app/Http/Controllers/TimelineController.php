<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Platform;
use App\Models\Timeline;
use Illuminate\Database\Eloquent\Builder;

class TimelineController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $channel_platforms = Platform::orderBy('tool')->orderBy('position')->where('active', '=', '1')->get();
        $timeline = Timeline::orderBy('date', 'desc')->paginate(75);

        return Inertia::render('Timeline/Index', [
            'platforms' => Platform::orderBy('position')->get()->map(function ($platform) {
                return [
                    'name' => $platform->name,
                    'color' => $platform->color,
                    'icon' => $platform->icon,
                    'legacy' => $platform->legacy,
                    'tool' => $platform->tool,
                    'url' => route('front.timeline.show', $platform, false)
                ];
            }),
            'channel_platforms' => $channel_platforms->map(function ($platform) {
                return [
                    'name' => $platform->name,
                    'color' => $platform->color,
                    'icon' => $platform->icon,
                    'channels' => $platform->channels->where('active')->where('package', '=', 0)->map(function ($channel) {
                        $release_channel = $channel->releaseChannels
                            ->sortByDesc(function ($release_channel, $key) {
                                return $release_channel->release->canonical_version;
                            })->values()->first();
        
                        return [
                            'name' => $release_channel->short_name,
                            'order' => $channel->order,
                            'color' => $channel->color,
                            'flight' => [
                                'version' => $release_channel->latest->flight,
                                'date' => $release_channel->latest->timeline->date,
                                'url' => $release_channel->latest->url
                            ]
                        ];
                    })->sortBy('order')->values()->all(),
                ];
            }),
            'timeline' => $timeline->groupBy('date')->map(function ($items, $date) {
                return [
                    'date' => $items[0]->date,
                    'flights' => $items->groupBy(function($item, $key) {
                        if ($item->item_type === \App\Models\Flight::class) {
                            return $item->item->flight.'-'.$item->item->platform->position;
                        } else if ($item->item_type === \App\Models\Promotion::class) {
                            return $item->item->platform->position.'.'.$item->item->releaseChannel->release->version.'.'.$item->item->releaseChannel->channel->order;
                        } else if ($item->item_type === \App\Models\Launch::class) {
                            return $item->item->platform->position.'.'.$item->item->release->version;
                        }
                    })->map(function ($flights) {
                        if ($flights->first()->item_type === \App\Models\Flight::class) {
                            $_cur_flight = $flights->first();
                            return [
                                'type' => 'flight',
                                'event_priority' => 3,
                                'id' => $_cur_flight->item->id,
                                'flight' => $_cur_flight->item->releaseChannel->release->package ? $_cur_flight->item->version : $_cur_flight->item->flight,
                                'date' => $_cur_flight->item->timeline->date,
                                'version' => $_cur_flight->item->releaseChannel->release->version,
                                'cversion' => $_cur_flight->item->releaseChannel->release->canonical_version,
                                'package' => $_cur_flight->item->releaseChannel->release->package ? $_cur_flight->item->releaseChannel->release->name : false,
                                'release_channel' => $flights->map(function ($channels) {
                                    return [
                                        'order' => $channels->item->releaseChannel->channel->order,
                                        'name' => $channels->item->releaseChannel->short_name,
                                        'color' => $channels->item->releaseChannel->channel->color
                                    ];
                                })->sortBy('order')->values()->all(),
                                'platform' => [
                                    'order' => $_cur_flight->item->platform->order,
                                    'icon' => $_cur_flight->item->platform->icon,
                                    'name' => $_cur_flight->item->platform->name,
                                    'tool' => $_cur_flight->item->platform->tool,
                                    'color' => $_cur_flight->item->platform->color
                                ],
                                'url' => $_cur_flight->item->url
                            ];
                        }
                        
                        if ($flights->first()->item_type === \App\Models\Promotion::class) {
                            $_cur_promotion = $flights->first();
                            return [
                                'type' => 'promotion',
                                'event_priority' => 2,
                                'id' => $_cur_promotion->item->id,
                                'date' => $_cur_promotion->item->timeline->date,
                                'version' => $_cur_promotion->item->releaseChannel->release->version,
                                'cversion' => $_cur_promotion->item->releaseChannel->release->canonical_version,
                                'release_channel' => [
                                    'name' => $_cur_promotion->item->releaseChannel->short_name,
                                    'color' => $_cur_promotion->item->releaseChannel->channel->color
                                ],
                                'platform' => [
                                    'order' => $_cur_promotion->item->platform->order,
                                    'icon' => $_cur_promotion->item->platform->icon,
                                    'name' => $_cur_promotion->item->platform->name,
                                    'color' => $_cur_promotion->item->platform->color
                                ],
                                'url' => $_cur_promotion->item->url
                            ]; 
                        }
                        
                        if ($flights->first()->item_type === \App\Models\Launch::class) {
                            $_cur_launch = $flights->first();
                            return [
                                'type' => 'launch',
                                'event_priority' => 1,
                                'id' => $_cur_launch->item->id,
                                'date' => $_cur_launch->item->timeline->date,
                                'version' => $_cur_launch->item->release->version,
                                'cversion' => $_cur_launch->item->release->canonical_version,
                                'platform' => [
                                    'order' => $_cur_launch->item->platform->order,
                                    'icon' => $_cur_launch->item->platform->icon,
                                    'name' => $_cur_launch->item->platform->name,
                                    'color' => $_cur_launch->item->platform->color
                                ],
                                'url' => $_cur_launch->item->url
                            ];
                        }
                    })->sortByDesc(function ($item, $key) {
                        if ($item['type'] === 'flight') {
                            return $item['event_priority'].'.'.$item['cversion'].'.'.$item['flight'].'.'.$item['platform']['order'];
                        }
                        
                        return $item['event_priority'].'.'.$item['cversion'].'.'.$item['platform']['order'];
                    })->values()->all()
                ];
            }),
            'pagination' => [
                'prev_page_url' => $timeline->previousPageUrl(),
                'next_page_url' => $timeline->nextPageUrl()
            ],
            'status' => session('status')
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Platform $platform)
    {
        $channel_platforms = Platform::orderBy('tool')->orderBy('position')->where('active', '=', '1')->get();

        $timeline = Timeline::orderBy('date', 'desc')
            ->whereHas('flight', function (Builder $query) use ($platform) {
                $query->join('release_channels as frs', function ($join) {
                    $join->on('frs.id', '=', 'flights.release_channel_id')
                
                    ->join('channels as fc', function ($join) {
                        $join->on('fc.id', '=', 'frs.channel_id');
                    });
                })
                ->where('fc.platform_id', '=', $platform->id);
            })
            ->orWhereHas('promotion', function (Builder $query) use ($platform) {
                $query->join('release_channels as prs', function ($join) {
                    $join->on('prs.id', '=', 'promotions.release_channel_id')
                
                    ->join('channels as pc', function ($join) {
                        $join->on('pc.id', '=', 'prs.channel_id');
                    });
                })
                ->where('pc.platform_id', '=', $platform->id);
            })
            ->orWhereHas('launch', function (Builder $query) use ($platform) {
                $query->join('releases as lr', function ($join) {
                    $join->on('lr.id', '=', 'launches.release_id');
                })
                ->where('lr.platform_id', '=', $platform->id);
            })
            ->paginate(75);

        return Inertia::render('Timeline/Show', [
            'platforms' => Platform::orderBy('position')->get()->map(function ($_platform) {
                return [
                    'id' => $_platform->id,
                    'name' => $_platform->name,
                    'color' => $_platform->color,
                    'icon' => $_platform->icon,
                    'legacy' => $_platform->legacy,
                    'tool' => $_platform->tool,
                    'url' => route('front.timeline.show', $_platform, false)
                ];
            }),
            'platform' => [
                'name' => $platform->name,
                'icon' => $platform->icon,
                'color' => $platform->color
            ],
            'channel_platforms' => $channel_platforms->map(function ($platform) {
                return [
                    'name' => $platform->name,
                    'color' => $platform->color,
                    'icon' => $platform->icon,
                    'channels' => $platform->channels->where('active')->where('package', '=', 0)->map(function ($channel) {
                        $release_channel = $channel->releaseChannels
                            ->sortByDesc(function ($release_channel, $key) {
                                return $release_channel->release->canonical_version;
                            })->values()->first();
        
                        return [
                            'name' => $release_channel->short_name,
                            'order' => $channel->order,
                            'color' => $channel->color,
                            'flight' => [
                                'version' => $release_channel->latest->flight,
                                'date' => $release_channel->latest->timeline->date,
                                'url' => $release_channel->latest->url
                            ]
                        ];
                    })->sortBy('order')->values()->all(),
                ];
            }),
            'timeline' => $timeline->sortByDesc('date')->groupBy('date')->map(function ($items, $date) {
                return [
                    'date' => $items[0]->date,
                    'flights' => $items->groupBy(function($item, $key) {
                        if ($item->item_type === \App\Models\Flight::class) {
                            return $item->item->flight.'-'.$item->item->platform->position;
                        } else if ($item->item_type === \App\Models\Promotion::class) {
                            return $item->item->platform->position.'.'.$item->item->releaseChannel->release->version.'.'.$item->item->releaseChannel->channel->order;
                        } else if ($item->item_type === \App\Models\Launch::class) {
                            return $item->item->platform->position.'.'.$item->item->release->version;
                        }
                    })->map(function ($flights) {
                        if ($flights->first()->item_type === \App\Models\Flight::class) {
                            $_cur_flight = $flights->first();
                            return [
                                'type' => 'flight',
                                'event_priority' => 3,
                                'id' => $_cur_flight->item->id,
                                'flight' => $_cur_flight->item->releaseChannel->release->package ? $_cur_flight->item->version : $_cur_flight->item->flight,
                                'date' => $_cur_flight->item->timeline->date,
                                'version' => $_cur_flight->item->releaseChannel->release->version,
                                'cversion' => $_cur_flight->item->releaseChannel->release->canonical_version,
                                'package' => $_cur_flight->item->releaseChannel->release->package ? $_cur_flight->item->releaseChannel->release->name : false,
                                'release_channel' => $flights->map(function ($channels) {
                                    return [
                                        'order' => $channels->item->releaseChannel->channel->order,
                                        'name' => $channels->item->releaseChannel->short_name,
                                        'color' => $channels->item->releaseChannel->channel->color
                                    ];
                                })->sortBy('order')->values()->all(),
                                'platform' => [
                                    'order' => $_cur_flight->item->platform->order,
                                    'icon' => $_cur_flight->item->platform->icon,
                                    'name' => $_cur_flight->item->platform->name,
                                    'tool' => $_cur_flight->item->platform->tool,
                                    'color' => $_cur_flight->item->platform->color
                                ],
                                'url' => $_cur_flight->item->url
                            ];
                        }
                        
                        if ($flights->first()->item_type === \App\Models\Promotion::class) {
                            $_cur_promotion = $flights->first();
                            return [
                                'type' => 'promotion',
                                'event_priority' => 2,
                                'id' => $_cur_promotion->item->id,
                                'date' => $_cur_promotion->item->timeline->date,
                                'version' => $_cur_promotion->item->releaseChannel->release->version,
                                'cversion' => $_cur_promotion->item->releaseChannel->release->canonical_version,
                                'release_channel' => [
                                    'name' => $_cur_promotion->item->releaseChannel->short_name,
                                    'color' => $_cur_promotion->item->releaseChannel->channel->color
                                ],
                                'platform' => [
                                    'order' => $_cur_promotion->item->platform->order,
                                    'icon' => $_cur_promotion->item->platform->icon,
                                    'name' => $_cur_promotion->item->platform->name,
                                    'color' => $_cur_promotion->item->platform->color
                                ],
                                'url' => $_cur_promotion->item->url
                            ]; 
                        }
                        
                        if ($flights->first()->item_type === \App\Models\Launch::class) {
                            $_cur_launch = $flights->first();
                            return [
                                'type' => 'launch',
                                'event_priority' => 1,
                                'id' => $_cur_launch->item->id,
                                'date' => $_cur_launch->item->timeline->date,
                                'version' => $_cur_launch->item->release->version,
                                'cversion' => $_cur_launch->item->release->canonical_version,
                                'platform' => [
                                    'order' => $_cur_launch->item->platform->order,
                                    'icon' => $_cur_launch->item->platform->icon,
                                    'name' => $_cur_launch->item->platform->name,
                                    'color' => $_cur_launch->item->platform->color
                                ],
                                'url' => $_cur_launch->item->url
                            ];
                        }
                    })->sortByDesc(function ($item, $key) {
                        if ($item['type'] === 'flight') {
                            return $item['event_priority'].'.'.$item['cversion'].'.'.$item['flight'].'.'.$item['platform']['order'];
                        }
                        
                        return $item['event_priority'].'.'.$item['cversion'].'.'.$item['platform']['order'];
                    })->values()->all()
                ];
            }),
            'pagination' => [
                'prev_page_url' => $timeline->previousPageUrl(),
                'next_page_url' => $timeline->nextPageUrl()
            ],
            'status' => session('status')
        ]);
    }
}
